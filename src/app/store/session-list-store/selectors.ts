import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { SessionListState, sessionListAdapter } from './state';
import { Session } from '../../game-wrapper/game.interfaces';


const getLoaded = (state: SessionListState): boolean => state.loaded;


export const selectSessionListState: MemoizedSelector<object, SessionListState>
  = createFeatureSelector<SessionListState>('sessionList');

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = sessionListAdapter.getSelectors();

export const selectSessionListAll: MemoizedSelector<object, Session[]>
  = createSelector(selectSessionListState, selectAll);

export const selectSessionListIds: MemoizedSelector<object, string[] | number[]>
  = createSelector(selectSessionListState, selectIds);

export const selectSessionListLoaded: MemoizedSelector<object, boolean>
  = createSelector(selectSessionListState, getLoaded);
