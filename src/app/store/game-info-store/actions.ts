import { Action } from '@ngrx/store';
import { GameMode } from '../../game-wrapper/game.interfaces';


export enum ActionTypes {
  ClearGameRelatedStates = '[GAME ON_DESTROY] Clear All States Related To The Game',
  SetGameInfo = '[GAME] Set Game Info',
  ClearGameInfoState = '[GAME ON_DESTROY] Clear Game Info State',
}


export class SetGameInfo implements Action {
  readonly type = ActionTypes.SetGameInfo;
  constructor(public payload: { id?: string, name?: string, gameMode?: GameMode }) {}
}

export class ClearGameInfoState implements Action {
  readonly type = ActionTypes.ClearGameInfoState;
}

export class ClearGameRelatedStates implements Action {
  readonly type = ActionTypes.ClearGameRelatedStates;
}


export type Actions = SetGameInfo | ClearGameInfoState | ClearGameRelatedStates;
