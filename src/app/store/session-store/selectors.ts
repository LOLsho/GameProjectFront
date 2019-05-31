import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { SessionState } from './state';


const getId = (state: SessionState): string => state.id;
const getIsOver = (state: SessionState): boolean => state.isSessionOver;


export const selectSessionState: MemoizedSelector<object, SessionState>
  = createFeatureSelector<SessionState>('session');

export const selectSessionId: MemoizedSelector<object, string>
  = createSelector(selectSessionState, getId);

export const selectIsSessionOver: MemoizedSelector<object, boolean>
  = createSelector(selectSessionState, getIsOver);
