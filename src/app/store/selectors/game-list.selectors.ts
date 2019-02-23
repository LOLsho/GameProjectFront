import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameListState, selectGameList } from '../reducers/games-list.reduces';


export const getGameListState = createFeatureSelector<GameListState>('gameList');

export const getGameList = createSelector(getGameListState, selectGameList);
