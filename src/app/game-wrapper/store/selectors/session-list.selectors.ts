import { createFeatureSelector, createSelector } from '@ngrx/store';
import { sessionListAdapter, SessionListState } from '../reducers/session-list.reducer';


export const selectSessionListState = createFeatureSelector<SessionListState>('sessionList');

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = sessionListAdapter.getSelectors();

export const selectAllSessions = createSelector(selectSessionListState, selectAll);
export const selectSessionListIds = createSelector(selectSessionListState, selectIds);

export const selectSessionListLoaded = createSelector(
  selectSessionListState,
  (state: SessionListState) => state.loaded
);

