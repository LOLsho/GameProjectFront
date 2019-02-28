import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWrapperComponent } from './game-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../modules/shared.module';
import { CustomFieldComponent } from '../games/sapper/custom-field/custom-field.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from '../games/sapper/sapper.component';
import { MenuComponent } from '../elements/menu/menu.component';
import { StartGameMenuComponent } from './start-game-menu/start-game-menu.component';
import { StoreModule } from '@ngrx/store';
import { gameListReducer } from '../store/reducers/games-list.reduces';
import { EffectsModule } from '@ngrx/effects';
import { GamesListEffects } from '../store/effects/games-list.effects';
import { sessionReducer } from './store/reducers/session.reducer';
import { SessionEffects } from './store/effects/session.effects';


const ROUTES: Routes = [
  {
    path: '',
    component: GameWrapperComponent,
  },
  {
    path: ':game',
    component: GameWrapperComponent,
  },
];


const gamesComponents = [
  CustomFieldComponent,
  TicTacToeComponent,
  SapperComponent,
];


@NgModule({
  declarations: [
    GameWrapperComponent,
    ...gamesComponents,
    MenuComponent,
    StartGameMenuComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('game', sessionReducer),
    // StoreModule.forFeature('', '', {}),
    EffectsModule.forFeature([SessionEffects]),
  ],
  entryComponents: [
    ...gamesComponents,
  ],
})
export class GameWrapperModule { }
