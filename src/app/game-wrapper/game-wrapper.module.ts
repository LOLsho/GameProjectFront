import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWrapperComponent } from './game-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../modules/shared.module';
import { Game, GAMES } from '../game-list/game-list';
import { CustomFieldComponent } from '../games/sapper/custom-field/custom-field.component';


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
    ...gamesComponents,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
  ],
  entryComponents: [
    CustomFieldComponent,
    ...gamesComponents,
  ],
})
export class GameWrapperModule { }
