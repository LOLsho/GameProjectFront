import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWrapperComponent } from './game-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../modules/shared.module';
import { GAMES } from '../game-list/game-list';
import { CustomFieldComponent } from '../games/sapper/custom-field/custom-field.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from '../games/sapper/sapper.component';
import { Game } from './game.interfaces';


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


const gamesComponents = GAMES.map((game: Game) => game.component);


@NgModule({
  declarations: [
    GameWrapperComponent,
    CustomFieldComponent,
    TicTacToeComponent,
    SapperComponent,
    // ...gamesComponents,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
  ],
  entryComponents: [
    CustomFieldComponent,
    TicTacToeComponent,
    SapperComponent,
    // ...gamesComponents,
  ],
})
export class GameWrapperModule { }
