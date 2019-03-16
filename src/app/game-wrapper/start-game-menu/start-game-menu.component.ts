import {
  Component,
  ComponentFactoryResolver, ComponentRef,
  EventEmitter, OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MenuOption } from '../../elements/menu/menu.component';
import {
  CreatedSession, GameDataForLaunching,
  GameInitial,
  GameMode,
  MultiModeAction, Session,
  SingleModeAction,
} from '../game.interfaces';
import { MultiGameSettings } from './create-new-multi-game/multi-game-setting.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { Subscription } from 'rxjs';
import { CreateSession, SetSession, SubscribeToSession } from '../store/actions/session.actions';
import { FirestoreService, Query } from '../../services/firestore.service';
import { filter, pluck, switchMap } from 'rxjs/operators';
import { GAMES } from '../../game-list/game-list';
import { SetGameInfo } from '../store/actions/game-info.actions';
import { getUser } from '../../store/selectors/auth.selectors';
import { User } from '../../auth/auth.interface';
import { selectGameInfoState } from '../store/selectors/game-info.selectors';
import { GameInfoState } from '../store/reducers/game-info.reducer';
import { ActivatedRoute } from '@angular/router';
import { SessionListComponent } from '../../elements/session-list/session-list.component';
import { SubscribeToSessionList, UnsubscribeFromSessionList } from '../store/actions/session-list.actions';
import { selectAllSessions, selectSessionListLoaded } from '../store/selectors/session-list.selectors';
import { LoadSteps } from '../store/actions/steps.actions';
import { CreateNewMultiGameComponent } from './create-new-multi-game/create-new-multi-game.component';
import { EnterIdComponent } from './enter-id/enter-id.component';

@Component({
  selector: 'app-start-game-menu',
  templateUrl: './start-game-menu.component.html',
  styleUrls: ['./start-game-menu.component.scss']
})
export class StartGameMenuComponent implements OnInit, OnDestroy {

  @ViewChild('componentEntry', { read: ViewContainerRef }) componentEntry: ViewContainerRef;

  gameInitials: GameInitial;
  user: User;
  gameInfo: GameInfoState;

  gameMode: GameMode;
  singleModeAction: SingleModeAction;
  multiModeAction: MultiModeAction;
  multiGameSettings: MultiGameSettings;

  subscriptions: Subscription[] = [];

  choseModeOptions: MenuOption[] = [
    { value: 'single', capture: 'CHOOSE-MODE__SINGLE' },
    { value: 'multiplayer', capture: 'CHOOSE-MODE__MULTIPLAYER', disabled: true },
  ];
  choseSingleModeActions: MenuOption[] = [
    { value: 'newGame', capture: 'SINGLE-MODE-ACTIONS__NEW' },
    { value: 'continueLast', capture: 'SINGLE-MODE-ACTIONS__CONTINUE-LAST' },
    { value: 'continue', capture: 'SINGLE-MODE-ACTIONS__CONTINUE' },
    { value: 'watchSavedGames', capture: 'SINGLE-MODE-ACTIONS__WATCH', disabled: true },
  ];
  choseMultiModeActions: MenuOption[] = [
    { value: 'createNewGame', capture: 'MULTI-MODE-ACTIONS__CREATE-NEW' },
    { value: 'joinGameById', capture: 'MULTI-MODE-ACTIONS__JOIN-GAME-BY-ID' },
    { value: 'joinGame', capture: 'MULTI-MODE-ACTIONS__JOIN-GAME' },
    { value: 'watchSavedGames', capture: 'MULTI-MODE-ACTIONS__WATCH' },
  ];

  @Output() gameDataPrepared = new EventEmitter<GameDataForLaunching>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private resolver: ComponentFactoryResolver,
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

  ngOnInit() {
    this.choseModeOptions[0].disabled = this.gameInitials.startGameConfig.singleMode.disabled;
    this.choseModeOptions[1].disabled = this.gameInitials.startGameConfig.multiplayerMode.disabled;

    this.choseSingleModeActions[1].disabled = this.gameInitials.startGameConfig.singleMode.continueLastDisabled;
    this.choseSingleModeActions[2].disabled = this.gameInitials.startGameConfig.singleMode.continueDisabled;
    this.choseSingleModeActions[3].disabled = this.gameInitials.startGameConfig.singleMode.watchSavedGamesDisabled;

    this.choseMultiModeActions[0].disabled = this.gameInitials.startGameConfig.multiplayerMode.createNewDisabled;
    this.choseMultiModeActions[1].disabled = this.gameInitials.startGameConfig.multiplayerMode.joinGameByIdDisabled;
    this.choseMultiModeActions[2].disabled = this.gameInitials.startGameConfig.multiplayerMode.joinGameDisabled;
    this.choseMultiModeActions[3].disabled = this.gameInitials.startGameConfig.multiplayerMode.watchSavedGamesDisabled;
  }

  gameModeSelected(gameMode: GameMode) {
    this.gameMode = gameMode;
    this.store.dispatch(new SetGameInfo({ gameMode: this.gameMode }));
  }

  singleModeActionSelected(singleModeAction: SingleModeAction) {
    this.singleModeAction = singleModeAction;

    switch (this.singleModeAction) {
      case 'newGame':
        if (this.gameInitials.menuComponent) this.showGameMenu();
        else this.emitPreparedGameData();
        break;
      case 'continue':
        this.showSessionList(); break;
    }
  }

  showGameMenu() {
    const gameMenuRef = this.createComponent(this.gameInitials.menuComponent);

    this.subscriptions.push(
      gameMenuRef.instance.menuClosed.subscribe((specificGameDetails) => {
        gameMenuRef.destroy();
        this.createSession(specificGameDetails);
        this.emitPreparedGameData();
      })
    );
  }

  showSessionList(): void {
    const sessionListRef = this.createComponent(SessionListComponent);

    let query: Query;
    if (this.gameMode === 'single') {
      query = {
        where: [
          { field: 'isSessionOver', opStr: '==', value: false },
          { field: 'gameMode', opStr: '==', value: 'single' },
          { field: 'creatorId', opStr: '==', value: this.user.uid },
        ]
      };
    } else {
      query = {
        where: [
          { field: 'gameMode', opStr: '==', value: 'multiplayer' },
          { field: 'isSessionOver', opStr: '==', value: false },
          { field: 'private', opStr: '==', value: false },
        ],
      };
    }


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


      this.store.dispatch(new LoadSteps({ sessionId: session.id }));
      if (this.gameMode === 'multiplayer') {
        this.store.dispatch(new SubscribeToSession({ id: session.id }));
      }

      this.emitPreparedGameData();
    }));
  }

  multiModeActionSelected(multiModeAction: MultiModeAction) {
    this.multiModeAction = multiModeAction;

    switch (this.multiModeAction) {
      case 'createNewGame':
        if (this.gameInitials.menuComponent) this.showCreateNewMultiGameMenu();
        break;
      case 'joinGameById':
        this.showEnterIdComponent(); break;
      case 'joinGame':
        this.showSessionList();
    }
  }

  showEnterIdComponent() {
    const componentRef = this.createComponent(EnterIdComponent);

    this.subscriptions.push(
      componentRef.instance.sessionFound.subscribe((session: Session) => {
        componentRef.destroy();

        this.store.dispatch(new SetSession(session));
        this.store.dispatch(new LoadSteps({ sessionId: session.id }));
        this.emitPreparedGameData();
      })
    );
  }

  showCreateNewMultiGameMenu() {
    const componentRef = this.createComponent(CreateNewMultiGameComponent);

    this.subscriptions.push(
      componentRef.instance.multiSettingsChosen.subscribe((multiGameSettings: MultiGameSettings) => {
        componentRef.destroy();
        this.multiGameSettings = multiGameSettings;
        this.showGameMenu();
      })
    );
  }

  createSession(specificGameDetails) {
    const payload: CreatedSession = this.generateDataForCreatedSession(specificGameDetails);
    this.store.dispatch(new CreateSession(payload));
  }

  createComponent(component): ComponentRef<any> {
    const factory = this.resolver.resolveComponentFactory(component);
    return this.componentEntry.createComponent(factory);
  }

  generateDataForCreatedSession(createdGameData: any): CreatedSession {
    const newSession: CreatedSession = {
      created: this.firestoreService.getFirestoreTimestamp(),
      creatorId: this.user.uid,
      gameMode: this.gameMode,
      gameData: createdGameData,
      isSessionOver: false,
    };

    if (newSession.gameMode === 'multiplayer') {
      newSession.private = this.multiGameSettings.private;
    }

    return newSession;
  }

  emitPreparedGameData() {
    this.gameDataPrepared.emit({
      gameMode: this.gameMode,
      action: this.gameMode === 'single' ? this.singleModeAction : this.multiModeAction,
      gameComponent: this.gameInitials.component,
      user: this.user,
      withFirebaseConnection: !!this.gameInitials.menuComponent,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
