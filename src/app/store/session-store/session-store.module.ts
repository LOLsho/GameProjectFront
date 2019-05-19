import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { sessionListReducer } from '../session-list-store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './effects';


@NgModule({
  imports: [
    StoreModule.forFeature('session', sessionListReducer),
    EffectsModule.forFeature([SessionEffects]),
  ],
  providers: [
    SessionEffects,
  ],
})
export class SessionStoreModule { }
