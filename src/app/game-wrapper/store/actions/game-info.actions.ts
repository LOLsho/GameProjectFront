import { Action } from '@ngrx/store';
import { GameMode } from '../../game.interfaces';


export enum GameInfoActionTypes {
  ClearGameRelatedStates = '[GAME ON_DESTROY] Clear All States Related To The Game',
  SetGameInfo = '[GAME] Set Game Info',
  ClearGameInfoState = '[GAME ON_DESTROY] Clear Game Info State',
}


export class SetGameInfo implements Action {
  readonly type = GameInfoActionTypes.SetGameInfo;
  constructor(public payload: { id?: string, name?: string, gameMode?: GameMode }) {}
}

export class ClearGameInfoState implements Action {
  readonly type = GameInfoActionTypes.ClearGameInfoState;
}

export class ClearGameRelatedStates implements Action {
  readonly type = GameInfoActionTypes.ClearGameRelatedStates;
}


export type GameInfoActions = SetGameInfo | ClearGameInfoState | ClearGameRelatedStates;
