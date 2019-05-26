import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playersReducer } from '@store/players-store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { PlayersEffects } from '@store/players-store/effects';


@NgModule({
  imports: [
    StoreModule.forFeature('players', playersReducer),
    EffectsModule.forFeature([PlayersEffects]),
  ],
  providers: [
    PlayersEffects,
  ],
})
export class PlayersStoreModule { }

