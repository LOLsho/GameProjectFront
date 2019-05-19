import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { GameInfoState } from './state';
import { GameMode } from '../../game-wrapper/game.interfaces';


const getId = (state: GameInfoState): string => state.id;
const getName = (state: GameInfoState): string => state.name;
const getGameMode = (state: GameInfoState): GameMode => state.gameMode;

export const selectGameInfoState: MemoizedSelector<object, GameInfoState>
  = createFeatureSelector<GameInfoState>('gameInfo');

export const selectGameId: MemoizedSelector<object, string>
  = createSelector(selectGameInfoState, getId);

export const selectGameName: MemoizedSelector<object, string>
  = createSelector(selectGameInfoState, getName);

export const selectGameMode: MemoizedSelector<object, GameMode>
  = createSelector(selectGameInfoState, getGameMode);
