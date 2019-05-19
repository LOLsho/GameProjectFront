import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { gameInfoReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { GameInfoEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('gameInfo', gameInfoReducer),
    EffectsModule.forFeature([GameInfoEffects])
  ],
  providers: [
    GameInfoEffects,
  ],
})
export class GameInfoStoreModule { }
