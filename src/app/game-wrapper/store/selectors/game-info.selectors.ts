import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameInfoState } from '../reducers/game-info.reducer';
import { GameSettings } from '../../game.interfaces';


export const selectGameInfoState = createFeatureSelector('gameInfo');

export const selectGameId = createSelector(selectGameInfoState, (state: GameInfoState) => state.id);

export const selectGameSettings = createSelector(selectGameInfoState, (state: GameInfoState) => state.settings);
export const selectGameMode = createSelector(selectGameSettings, (settings: GameSettings) => settings.gameMode);
