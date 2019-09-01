import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameListComponent } from './game-list.component';
import { SharedModule } from '../../modules/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


const ROUTES: Routes = [
  {
    path: '',
    component: GameListComponent,
  },
];


@NgModule({
  declarations: [
    GameListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
    // StoreModule.forFeature('gameList', gameListReducer),
    // EffectsModule.forFeature([GamesListEffects]),
  ],
})
export class GameListModule { }
