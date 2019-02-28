import {
  Component,
  ComponentFactoryResolver, ComponentRef, OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GAMES } from '../game-list/game-list';
import { GameInitial, GameSettings } from './game.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { getUser } from '../store/selectors/auth.selectors';
import { User } from '../auth/auth.interface';
import { Subscription } from 'rxjs';
import { ClearGameState, CreateSession, SetGameState, UpdateSession } from './store/actions/session.actions';
import { FirestoreService } from '../services/firestore.service';
import { GameState } from './store/reducers/session.reducer';
import { selectGameState } from './store/selectors/session.selectors';


@Component({
  selector: 'app-game-wrapper',
  styleUrls: ['./game-wrapper.component.scss'],
  templateUrl: './game-wrapper.component.html'
})
export class GameWrapperComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  user: User;
  gameName: string;
  currentGame: GameState;

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

  onSettingsChosen(settings: GameSettings): void {
    this.gameSettings = settings;
    if (settings.gameMode === 'single') {
      // this.store
    }

    const factory = this.resolver.resolveComponentFactory(this.gameInitials.component);
    const gameComponent: ComponentRef<any> = this.gameEntry.createComponent(factory);
    gameComponent.instance.gameSettings = this.gameSettings;

    this.subscriptions.push(gameComponent.instance.gameCreated.subscribe((createdGameData: any) => {
      const payload = this.generateDataForCreatedSession(createdGameData);
      this.store.dispatch(new CreateSession(payload));
    }));

    this.subscriptions.push(gameComponent.instance.gameUpdated.subscribe((updatedGameData: any) => {
      const payload = this.generateDataForUpdatedSession(updatedGameData);
      this.store.dispatch(new UpdateSession(payload));
    }));

    this.subscriptions.push(gameComponent.instance.step.subscribe((step: { cellId: number }) => {
      const payload = this.generateDataForGameStep(step);
      // this.store.dispatch(new UpdateSession(payload));
    }));
  }

  subscribeToRequiredData(): void {
    this.subscriptions = [

      this.route.params.subscribe(params => {
        this.gameName = params.game;
        this.gameInitials = GAMES.find(game => game.name === params.game);

        this.firestoreService.getGameIdByName(this.gameName).subscribe((id: string) => {
          this.store.dispatch(new SetGameState({ id: id, name: this.gameName }));
        });
      }),

      this.store.select(getUser).subscribe((user: User) => {
        this.user = user;
      }),

      this.store.select(selectGameState).subscribe((game: GameState) => {
        this.currentGame = game;
      })
    ];
  }

  ngOnInit(): void {

  }

  get conditionToShowStartingMenu(): boolean {
    return !!this.user && !!this.currentGame && !this.gameSettings;
  }

  generateDataForCreatedSession(createdGameData: any) {
    return {
      sessionData: {
        creatorId: this.user.uid,
        created: this.firestoreService.getFirestoreTimestamp(),
        gameData: createdGameData,
        settings: this.gameSettings,
      },
    };
  }

  generateDataForGameStep(step: { cellId: number }) {
    return {
      ...step,
      userId: this.user.uid,
      timestamp: this.firestoreService.getFirestoreTimestamp(),
    };
  }

  generateDataForUpdatedSession(updatedGameData: any) {
    return {
      updatedSessionData: {
        gameData: updatedGameData,
      },
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });

    this.store.dispatch(new ClearGameState());
  }
}
