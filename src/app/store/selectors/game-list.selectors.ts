import { createFeatureSelector, createSelector } from '@ngrx/store';
import { gameListAdapter, GameListState } from '../reducers/games-list.reduces';


export const getGameListState = createFeatureSelector<GameListState>('gameList');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = gameListAdapter.getSelectors(getGameListState);

export const selectGameListIds = selectIds;
export const selectGameListEntities = selectEntities;
export const selectGameList = selectAll;
export const selectGameListLength = selectTotal;
export const selectGameListLoaded = createSelector(getGameListState, (state) => state.loaded );

// export const getGameList = createSelector(getGameListState, selectGameList);
