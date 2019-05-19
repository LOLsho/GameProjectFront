import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { GameListState, gameListAdapter } from './state';


export const getLoaded = (state: GameListState): boolean => state.loaded;


export const selectGameListState: MemoizedSelector<object, GameListState>
  = createFeatureSelector<GameListState>('gameList');

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = gameListAdapter.getSelectors(selectGameListState);

export const selectGameListIds = selectIds;
export const selectGameListEntities = selectEntities;
export const selectGameList = selectAll;
export const selectGameListLength = selectTotal;

export const selectGameListLoaded: MemoizedSelector<object, boolean>
  = createSelector(selectGameListState, getLoaded);

