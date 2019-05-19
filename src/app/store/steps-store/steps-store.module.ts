import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { stepsReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { StepsEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('steps', stepsReducer),
    EffectsModule.forFeature([StepsEffects]),
  ],
  providers: [
    StepsEffects,
  ],
})
export class StepsStoreModule { }
