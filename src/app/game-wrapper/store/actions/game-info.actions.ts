import { Action } from '@ngrx/store';
import { GameMode } from '../../game.interfaces';


export const CLEAR_GAME_RELATED_STATES = '[GAME ON_DESTROY] Clear All States Related To The Game';
export const SET_GAME_INFO = '[GAME] Set Game Info';
export const CLEAR_GAME_INFO_STATE = '[GAME ON_DESTROY] Clear Game Info State';


export class SetGameInfo implements Action {
  readonly type = SET_GAME_INFO;
  constructor(public payload: { id?: string, name?: string, gameMode?: GameMode }) {}
}

export class ClearGameInfoState implements Action {
  readonly type = CLEAR_GAME_INFO_STATE;
}

export class ClearGameRelatedStates implements Action {
  readonly type = CLEAR_GAME_RELATED_STATES;
}


export type GameInfoActions = SetGameInfo | ClearGameInfoState | ClearGameRelatedStates;
