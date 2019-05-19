import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { sessionListReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { SessionListEffects } from './effects';


@NgModule({
  imports: [
    StoreModule.forFeature('sessionList', sessionListReducer),
    EffectsModule.forFeature([SessionListEffects]),
  ],
  providers: [
    SessionListEffects,
  ],
})
export class SessionListStoreModule { }
