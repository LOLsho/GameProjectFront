import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects';

@NgModule({
  imports: [
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    AuthEffects,
  ],
})
export class AuthStoreModule { }
