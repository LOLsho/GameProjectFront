import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { gameListReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { GamesListEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('gameList', gameListReducer),
    EffectsModule.forFeature([GamesListEffects]),
  ],
  providers: [
    GamesListEffects,
  ],
})
export class GameListStoreModule { }
