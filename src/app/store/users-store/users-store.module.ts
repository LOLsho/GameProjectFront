import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { usersReducer } from '@store/users-store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from '@store/users-store/effects';


@NgModule({
  imports: [
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UsersEffects]),
  ],
  providers: [UsersEffects],
})
export class UsersStoreModule {}
