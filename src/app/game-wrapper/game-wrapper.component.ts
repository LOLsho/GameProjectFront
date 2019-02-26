import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver, ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GAMES } from '../game-list/game-list';
import { GameInitial, GameSettings } from './game.interfaces';
import { Store } from '@ngrx/store';
import { GameListState } from '../store/reducers/games-list.reduces';
import { SapperComponent } from '../games/sapper/sapper.component';


@Component({
  selector: 'app-game-wrapper',
  styleUrls: ['./game-wrapper.component.scss'],
  template: `
    <app-start-game-menu *ngIf="!gameSettings"
                         [startGameConfig]="currentGame.startGameConfig"
                         (gameSettingsChosen)="onSettingsChosen($event)"
    ></app-start-game-menu>
    <div class="game-wrap">
      <div #gameEntry></div>
    </div>
  `
})
export class GameWrapperComponent implements OnInit, AfterContentInit {

  @ViewChild('gameEntry', { read: ViewContainerRef }) gameEntry: ViewContainerRef;

  currentGame: GameInitial;
  gameSettings: GameSettings;

  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private store: Store<GameListState>,
  ) { }

  ngAfterContentInit() {
    this.route.params.subscribe(params => {
      this.currentGame = GAMES.find(game => game.name === params.game);
    });
  }

  onSettingsChosen(settings: GameSettings) {
    this.gameSettings = settings;

    const factory = this.resolver.resolveComponentFactory(this.currentGame.component);
    const gameComponent: ComponentRef<any> = this.gameEntry.createComponent(factory);
    gameComponent.instance.gameSettings = this.gameSettings;
  }

  ngOnInit() {

  }
}
