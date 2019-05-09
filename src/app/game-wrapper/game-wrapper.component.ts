import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, } from '@angular/core';
import { GameDataForLaunching, Session, Step } from './game.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { of, Subscription } from 'rxjs';
import { SessionExit, UpdateSession } from './store/actions/session.actions';
import { FirestoreService } from '../services/firestore.service';
import { ClearGameRelatedStates } from './store/actions/game-info.actions';
import { filter, switchMap, take } from 'rxjs/operators';
import { selectSessionState } from './store/selectors/session.selectors';
import { selectAllSteps, selectLastStep, selectStepsLoaded } from './store/selectors/steps.selectors';
import { MakeStep } from './store/actions/steps.actions';
import { GameStep } from '../games/games.models';
import { emersionAnimation } from '../animations/emersion.animation';


@Component({
  selector: 'app-game-wrapper',
  styleUrls: ['./game-wrapper.component.scss'],
  templateUrl: './game-wrapper.component.html',
  animations: [emersionAnimation],
})
export class GameWrapperComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  gameLaunched: boolean;
  session: Session;
  steps: Step[];

  gameRef: ComponentRef<any>;
  pending: boolean;

  gameData: GameDataForLaunching;

  @ViewChild('gameEntry', { read: ViewContainerRef }) gameEntry: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
  ) {}

  ngOnInit() {}

  onGameDataPrepared(gameData: GameDataForLaunching) {
    this.gameData = gameData;

    if (this.gameData.withFirebaseConnection) {
      this.launchGame();
    } else {
      this.runGame();
    }
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

    if (this.gameData.gameMode === 'single') {
      sessionStream.pipe(take(1));

      if (this.gameData.action === 'newGame') {
        stepsStream = sessionStream.pipe(switchMap(() => of([])), take(1));
      } else if (this.gameData.action === 'continue') {

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

        if (this.gameData.gameMode === 'multiplayer') {
          this.subscriptions.push(this.store.select(selectLastStep).pipe(
            filter((lastStep: Step) => !!lastStep),
          ).subscribe((lastStep: Step) => {
            this.gameRef.instance.step = lastStep;
          }));
        }
      })
    );
  }

  runGame() {
    this.gameLaunched = true;
    this.gameRef = this.createComponent(this.gameData.gameComponent);
    const gameInstance = this.gameRef.instance;

    this.updateGameSessionInput();
    gameInstance.steps = this.steps;
    gameInstance.userData = this.gameData.user;


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
        const stepPayload: GameStep = this.generateDataForGameStep(step);
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
        this.gameData = null;
        this.unsubscribeAll();
      }));
    }
  }

  updateGameSessionInput() {
    this.gameRef.instance.session = this.session;
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

  generateDataForGameStep(step: any): GameStep {
    return {
      ...step,
      userId: this.gameData.user.uid,
      timestamp: this.firestoreService.getFirestoreTimestamp(),
    };
  }

  createComponent(component): ComponentRef<any> {
    const factory = this.resolver.resolveComponentFactory(component);
    return this.gameEntry.createComponent(factory);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.store.dispatch(new ClearGameRelatedStates());
  }
}
