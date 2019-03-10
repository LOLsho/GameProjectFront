import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, selectAuthPending, selectUser } from '../reducers/auth.reducer';
import { User } from '../../auth/auth.interface';

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(getAuthState, selectUser);
export const getAuthPending = createSelector(getAuthState, selectAuthPending);

export const selectUserId = createSelector(getUser, (user: User) => {
  if (user) return user.uid;
});
