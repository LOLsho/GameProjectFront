import { AuthState } from './state';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { User } from '../../auth/auth.interface';


const getUser = (state: AuthState): User => state.user;
const getPending = (state: AuthState): boolean => state.pending;

export const selectAuthState: MemoizedSelector<object, AuthState>
  = createFeatureSelector<AuthState>('auth');

export const selectAuthUser: MemoizedSelector<object, User>
  = createSelector(selectAuthState, getUser);

export const selectAuthPending: MemoizedSelector<object, boolean>
  = createSelector(selectAuthState, getPending);

export const selectAuthUserId: MemoizedSelector<object, string> = createSelector(
  selectAuthUser,
  (user: User) => {
    if (user) return user.uid;
  }
);
