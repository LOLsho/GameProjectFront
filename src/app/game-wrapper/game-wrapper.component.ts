import {
  Component,
  ComponentFactoryResolver, ComponentRef, OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GAMES } from '../game-list/game-list';
import { CreatedSession, GameInitial, GameSettings, NewStep, Session, Step } from './game.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { getUser } from '../store/selectors/auth.selectors';
import { User } from '../auth/auth.interface';
import { of, pipe, Subscription } from 'rxjs';
import {
  CreateSession, SessionExit, SetSession, SubscribeToSession,
  UpdateSession,
} from './store/actions/session.actions';
import { FirestoreService } from '../services/firestore.service';
import { ClearGameRelatedStates, SetGameInfo } from './store/actions/game-info.actions';
import { filter, pluck, switchMap, take } from 'rxjs/operators';
import { GameInfoState } from './store/reducers/game-info.reducer';
import { selectGameInfoState } from './store/selectors/game-info.selectors';
import { selectSessionState } from './store/selectors/session.selectors';
import { selectAllSteps, selectLastStep, selectStepsLoaded } from './store/selectors/steps.selectors';
import { SessionListComponent } from '../elements/session-list/session-list.component';
import { SubscribeToSessionList, UnsubscribeFromSessionList } from './store/actions/session-list.actions';
import { selectAllSessions, selectSessionListLoaded } from './store/selectors/session-list.selectors';
import { LoadSteps, MakeStep } from './store/actions/steps.actions';


@Component({
  selector: 'app-game-wrapper',
  styleUrls: ['./game-wrapper.component.scss'],
  templateUrl: './game-wrapper.component.html'
})
export class GameWrapperComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  gameLaunched: boolean;

  user: User;
  gameInfo: GameInfoState;
  session: Session;
  steps: Step[];

  gameRef: ComponentRef<any>;
  pending: boolean;

  @ViewChild('gameEntry', { read: ViewContainerRef }) gameEntry: ViewContainerRef;

  gameInitials: GameInitial;
  gameSettings: GameSettings;

  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
  ) {
    this.subscribeToRequiredData();
  }

  subscribeToRequiredData(): void {
    this.subscriptions = [

      this.route.params.pipe(
        pluck('game')
      ).subscribe((gameName: string) => {
        this.gameInitials = GAMES.find(gameInitial => gameInitial.name === gameName);

        this.firestoreService.getGameIdByName(gameName).subscribe((id: string) => {
          this.store.dispatch(new SetGameInfo({ id: id, name: gameName }));
        });
      }),

      this.store.select(getUser).subscribe((user: User) => {
        this.user = user;
      }),

      this.store.select(selectGameInfoState).subscribe((gameInfoState: GameInfoState) => {
        this.gameInfo = gameInfoState;
      }),
    ];
  }

  launchGame() {
    this.pending = true;

    const sessionStream = this.store.select(selectSessionState).pipe(
      filter((session: Session) => !!session.created)
    );
    let stepsStream = this.store.select(selectStepsLoaded).pipe(
      filter((loaded: boolean) => !!loaded),
      switchMap(() => this.store.select(selectAllSteps)),
      take(1),
    );
    // TODO change structure of gameSetting
    if (this.gameSettings.gameMode === 'single') {
      sessionStream.pipe(take(1));

      if (this.gameSettings.singleModeAction === 'newGame') {
        stepsStream = sessionStream.pipe(switchMap(() => of([])), take(1));
      } else if (this.gameSettings.singleModeAction === 'continue') {

      }
    }

    this.subscriptions.push(sessionStream.subscribe((session: Session) => {
      this.session = session;
      if (this.gameLaunched) this.updateGameSessionInput();
    }));

    this.subscriptions.push(stepsStream.subscribe(
      (steps: Step[]) => {
        this.steps = steps;
      },
      null,
      () => {
        this.pending = false;
        this.runGame();

        if (this.gameSettings.gameMode === 'multiplayer') {
          this.subscriptions.push(this.store.select(selectLastStep).pipe(
            filter((lastStep: Step) => !!lastStep),
          ).subscribe((lastStep: Step) => {
            this.gameRef.instance.step = lastStep;
          }));
        }
      })
    );
  }

  updateGameSessionInput() {
    this.gameRef.instance.session = this.session;
  }

  onSettingsChosen(settings: GameSettings): void {
    this.store.dispatch(new SetGameInfo({ settings }));
    this.gameSettings = settings;

    if (this.gameSettings.gameMode === 'single') {

      switch (this.gameSettings.singleModeAction) {
        case 'newGame':
          if (this.gameInitials.menuComponent) this.showGameMenu();
          else this.runGame(); // TODO REMOVE
          break;
        case 'continue':
          this.showSessionList();
          break;
      }
    }
  }

  showSessionList(): void {
    const sessionListRef = this.createComponent(SessionListComponent);

    const query = {
      where: [
        { field: 'isSessionOver', opStr: '==', value: false },
        { field: 'gameMode', opStr: '==', value: 'single' },
        { field: 'creatorId', opStr: '==', value: this.user.uid },
      ]
    };

    this.store.dispatch(new SubscribeToSessionList(query));
    this.subscriptions.push(this.store.select(selectSessionListLoaded).pipe(
      filter((loaded: boolean) => !!loaded),
      switchMap(() => this.store.select(selectAllSessions)),
    ).subscribe((sessionList: Session[]) => {
      sessionListRef.instance.sessions = sessionList;
    }));

    this.subscriptions.push(sessionListRef.instance.sessionChosen.subscribe((session: Session) => {
      sessionListRef.destroy();
      this.store.dispatch(new UnsubscribeFromSessionList());
      this.store.dispatch(new SetSession(session));


      // TODO move all subscriptions to launch game
      this.store.dispatch(new LoadSteps({ sessionId: session.id }));
      if (this.gameSettings.gameMode === 'multiplayer') {
        this.store.dispatch(new SubscribeToSession({ id: session.id }));
      }

      this.launchGame();
    }));
  }

  showGameMenu() {
    const gameMenuRef = this.createComponent(this.gameInitials.menuComponent);
    this.subscriptions.push(
      gameMenuRef.instance.menuClosed.subscribe((specificGameDetails) => {
        gameMenuRef.destroy();
        this.createSession(specificGameDetails);
        this.launchGame();
      })
    );
  }

  createSession(specificGameDetails) {
    const payload: CreatedSession = this.generateDataForCreatedSession(specificGameDetails);
    this.store.dispatch(new CreateSession(payload));
  }

  runGame() {
    this.gameRef = this.createComponent(this.gameInitials.component);
    this.gameLaunched = true;
    const gameInstance = this.gameRef.instance;

    this.updateGameSessionInput();
    gameInstance.steps = this.steps;
    gameInstance.userData = this.user;


    if (gameInstance.sessionUpdated) {
      this.subscriptions.push(gameInstance.sessionUpdated.subscribe((updatedSessionData: any) => {
        const payload = this.generateDataForUpdatedSession(updatedSessionData);
        this.store.dispatch(new UpdateSession(payload));
      }));
    }

    if (gameInstance.sessionFinished) {
      this.subscriptions.push(gameInstance.sessionFinished.subscribe((updatedSessionData: any) => {
        const payload = this.generateDataForFinishedSession(updatedSessionData);
        this.store.dispatch(new UpdateSession(payload));
      }));
    }

    if (gameInstance.stepMade) {
      this.subscriptions.push(gameInstance.stepMade.subscribe((step: any) => {
        const stepPayload: NewStep = this.generateDataForGameStep(step);
        this.store.dispatch(new MakeStep({
          step: stepPayload,
          sessionId: this.session.id,
        }));
      }));
    }

    if (gameInstance.exitSession) {
      this.subscriptions.push(gameInstance.exitSession.subscribe(() => {
        this.store.dispatch(new SessionExit());
        this.gameRef.destroy();
        this.gameLaunched = false;
        this.gameSettings = null;
        this.unsubscribeAll(); // TODO not quite right
      }));
    }
  }

  ngOnInit(): void {

  }

  get conditionToShowStartingMenu(): boolean {
    return !!this.user && !!this.gameInfo && !this.gameSettings;
  }

  generateDataForCreatedSession(createdGameData: any): CreatedSession {
    return {
      created: this.firestoreService.getFirestoreTimestamp(),
      creatorId: this.user.uid,
      gameMode: this.gameSettings.gameMode,
      gameData: createdGameData,
      isSessionOver: false,
    };
  }

  generateDataForUpdatedSession(updatedGameData: any): Partial<Session> {
    return {
      gameData: updatedGameData,
    };
  }

  generateDataForFinishedSession(updatedGameData: any): Partial<Session> {
    return {
      gameData: updatedGameData,
      isSessionOver: true,
    };
  }

  generateDataForGameStep(step: any): NewStep {
    return {
      ...step,
      userId: this.user.uid,
      timestamp: this.firestoreService.getFirestoreTimestamp(),
    };
  }

  createComponent(component): ComponentRef<any> {
    const factory = this.resolver.resolveComponentFactory(component);
    return this.gameEntry.createComponent(factory);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.store.dispatch(new ClearGameRelatedStates());
  }
}
