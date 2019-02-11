import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, selectAuthPending, selectUser } from '../reducers/auth.reducer';


export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(getAuthState, selectUser);
export const getAuthPending = createSelector(getAuthState, selectAuthPending);
