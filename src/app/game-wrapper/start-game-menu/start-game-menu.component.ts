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
  GameDataForLaunching,
  GameInitial,
  GameMode,
  MultiModeAction, Session,
  SingleModeAction,
} from '../game.interfaces';
import { MultiGameSettings } from './create-new-multi-game/multi-game-setting.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FirestoreService, Query } from '../../services/firestore.service';
import { filter, switchMap } from 'rxjs/operators';
import { GAMES } from '../../game-list/game-list';
import { User } from '../../auth/auth.interface';
import { SessionListComponent } from '../../elements/session-list/session-list.component';
import { CreateNewMultiGameComponent } from './create-new-multi-game/create-new-multi-game.component';
import { EnterIdComponent } from './enter-id/enter-id.component';
import { GameInfoState } from '@store/game-info-store/state';
import { AppState } from '@store/state';
import { selectGameNameFromParams } from '@store/router-store/selectors';
import { SetGameInfo } from '@store/game-info-store/actions';
import { selectAuthUser } from '@store/auth-store/selectors';
import { selectGameInfoState } from '@store/game-info-store/selectors';
import { SubscribeToSessionList, UnsubscribeFromSessionList } from '@store/session-list-store/actions';
import { selectSessionListAll, selectSessionListLoaded } from '@store/session-list-store/selectors';
import { CreateSession, SetSession, SubscribeToSession, UpdateSession } from '@store/session-store/actions';
import { LoadSteps } from '@store/steps-store/actions';
import { AddPlayer } from '@store/players-store/actions';



@Component({
  selector: 'app-start-game-menu',
  templateUrl: './start-game-menu.component.html',
  styleUrls: ['./start-game-menu.component.scss'],
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
    private store: Store<AppState>,
    private resolver: ComponentFactoryResolver,
    private firestoreService: FirestoreService,
  ) {
    this.subscribeToRequiredData();
  }

  subscribeToRequiredData(): void {
    this.subscriptions = [

      this.store.select(selectGameNameFromParams).pipe(
        filter(gameName => !!gameName),
      ).subscribe((gameName) => {

        this.gameInitials = GAMES.find(gameInitial => gameInitial.name === gameName);

        this.firestoreService.getGameIdByName(gameName).subscribe((id: string) => {
          this.store.dispatch(new SetGameInfo({ id: id, name: gameName }));
        });
      }),

      this.store.select(selectAuthUser).subscribe((user: User) => {
        this.user = user;
      }),

      this.store.select(selectGameInfoState)
        .subscribe((gameInfoState: GameInfoState) => {
          this.gameInfo = gameInfoState;
        }),
    ];
  }

  ngOnInit() {
    this.prepareMenu();
  }

  gameModeSelected(gameMode: GameMode) {
    this.gameMode = gameMode;
    this.store.dispatch(new SetGameInfo({ gameMode: this.gameMode }));
  }

  runGame(specificGameDetails) {
    this.createSession(specificGameDetails);
    this.emitPreparedGameData();
  }

  singleModeActionSelected(singleModeAction: SingleModeAction) {
    this.singleModeAction = singleModeAction;

    switch (this.singleModeAction) {
      case 'newGame':
        if (this.gameInitials.menuComponent) this.showGameMenu();
        else this.runGame({});
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
        this.runGame(specificGameDetails);
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
          { field: 'creator.uid', opStr: '==', value: this.user.uid },
        ],
      };
    } else {
      query = {
        where: [
          { field: 'isSessionOver', opStr: '==', value: false },
          { field: 'gameMode', opStr: '==', value: 'multiplayer' },
          { field: 'private', opStr: '==', value: false },
        ],
      };
    }

    this.store.dispatch(new SubscribeToSessionList(query));
    this.subscriptions.push(this.store.select(selectSessionListLoaded).pipe(
      filter((loaded: boolean) => !!loaded),
      switchMap(() => this.store.select(selectSessionListAll)),
    ).subscribe((sessionList: Session[]) => {
      sessionListRef.instance.sessions = sessionList;
      sessionListRef.instance.user = this.user;
    }));

    this.subscriptions.push(sessionListRef.instance.sessionChosen.subscribe((session: Session) => {
      sessionListRef.destroy();
      this.store.dispatch(new UnsubscribeFromSessionList());

      if (this.gameMode === 'multiplayer') {
        if (!session.playerIds.includes(this.user.uid)) {
          session.playerIds.push(this.user.uid);
          this.store.dispatch(new AddPlayer(this.user));
          this.store.dispatch(new UpdateSession({ playerIds: session.playerIds, id: session.id }));
        }
        this.store.dispatch(new SubscribeToSession({ id: session.id }));
      } else if (this.gameMode === 'single') {
        this.store.dispatch(new SetSession(session));
      }
      this.store.dispatch(new LoadSteps({ sessionId: session.id }));

      this.emitPreparedGameData();
    }));
  }

  multiModeActionSelected(multiModeAction: MultiModeAction) {
    this.multiModeAction = multiModeAction;

    switch (this.multiModeAction) {
      case 'createNewGame':
        this.showCreateNewMultiGameMenu(); break;
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

    componentRef.instance.preConfig = this.gameInitials.startGameConfig.multiplayerMode.multiModeConfig;
    this.subscriptions.push(
      componentRef.instance.multiSettingsChosen.subscribe((multiGameSettings: MultiGameSettings) => {
        componentRef.destroy();
        this.multiGameSettings = multiGameSettings;

        if (this.gameInitials.menuComponent) this.showGameMenu();
        else this.runGame({});
      }),
    );
  }

  createSession(specificGameDetails) {
    const payload: Session = this.generateDataForCreatedSession(specificGameDetails);
    this.store.dispatch(new CreateSession(payload));
  }

  createComponent(component): ComponentRef<any> {
    const factory = this.resolver.resolveComponentFactory(component);
    return this.componentEntry.createComponent(factory);
  }

  generateDataForCreatedSession(createdGameData: any): Session {
    const newSession: Session = {
      created: this.firestoreService.getFirestoreTimestamp(),
      creator: {
        uid: this.user.uid,
        photoURL: this.user.photoURL,
        name: this.user.name,
      },
      gameMode: this.gameMode,
      gameData: createdGameData,
      isSessionOver: false,
    };

    if (newSession.gameMode === 'multiplayer') {
      newSession.private = this.multiGameSettings.private;
      newSession.maxParticipants = this.multiGameSettings.maxParticipants;
      newSession.moveOrder = this.multiGameSettings.moveOrder;
      newSession.playerIds = [this.user.uid];
    }

    return newSession;
  }

  emitPreparedGameData() {
    this.gameDataPrepared.emit({
      gameMode: this.gameMode,
      action: this.gameMode === 'single' ? this.singleModeAction : this.multiModeAction,
      gameComponent: this.gameInitials.component,
      user: this.user,
    });
  }

  prepareMenu() {
    this.choseModeOptions[0].disabled = this.gameInitials.startGameConfig.singleMode.disabled;
    this.choseModeOptions[1].disabled = this.gameInitials.startGameConfig.multiplayerMode.disabled;

    this.choseSingleModeActions[0].disabled = this.gameInitials.startGameConfig.singleMode.disabled;
    this.choseSingleModeActions[1].disabled = this.gameInitials.startGameConfig.singleMode.continueLastDisabled;
    this.choseSingleModeActions[2].disabled = this.gameInitials.startGameConfig.singleMode.continueDisabled;
    this.choseSingleModeActions[3].disabled = this.gameInitials.startGameConfig.singleMode.watchSavedGamesDisabled;

    this.choseMultiModeActions[0].disabled = this.gameInitials.startGameConfig.multiplayerMode.createNewDisabled;
    this.choseMultiModeActions[1].disabled = this.gameInitials.startGameConfig.multiplayerMode.joinGameByIdDisabled;
    this.choseMultiModeActions[2].disabled = this.gameInitials.startGameConfig.multiplayerMode.joinGameDisabled;
    this.choseMultiModeActions[3].disabled = this.gameInitials.startGameConfig.multiplayerMode.watchSavedGamesDisabled;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
