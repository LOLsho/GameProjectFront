import { Action } from '@ngrx/store';
import { GameState } from '../reducers/session.reducer';


export const SET_GAME_STATE = '[GAME] Set Game State';

export const CREATE_SESSION = '[GAME] Create New Game Session';
export const SET_CREATED_SESSION = '[FIRESTORE API] Set Session After Successful Creation';

export const UPDATE_SESSION = '[GAME] Update Session';
export const SET_UPDATED_SESSION = '[FIRESTORE API] Set Session After Successful Update';

export const LOAD_GAME = '[GAME] Load Game';
export const LOAD_GAME_SUCCESS = '[FIRESTORE API] Load Game Success';
export const LOAD_GAME_FAIL = '[FIRESTORE API] Load Game Fail';

export const SESSION_FAIL = '[FIRESTORE API] Error working with session';
export const CLEAR_GAME_STATE = '[GAME] Clear Game State';



export class SetGameState implements Action {
  readonly type = SET_GAME_STATE;
  constructor(public payload: Partial<GameState>) {}
}

export class CreateSession implements Action {
  readonly type = CREATE_SESSION;
  constructor(public payload: { sessionData: any }) {}
}

export class SetCreatedSession implements Action {
  readonly type = SET_CREATED_SESSION;
  constructor(public payload: { session: any }) {}
}

export class UpdateSession implements Action {
  readonly type = UPDATE_SESSION;
  constructor(public payload: { updatedSessionData: any }) {}
}

export class SetUpdatedSession implements Action {
  readonly type = SET_UPDATED_SESSION;
  constructor(public payload: { updatedSessionData: any }) {}
}

export class LoadGame implements Action {
  readonly type = LOAD_GAME;
}

export class LoadGameSuccess implements Action {
  readonly type = LOAD_GAME_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadGameFail implements Action {
  readonly type = LOAD_GAME_FAIL;
  constructor(public payload: any) {}
}

export class SessionFail implements Action {
  readonly type = SESSION_FAIL;
  constructor(public payload: any) {}
}

export class ClearGameState {
  readonly type = CLEAR_GAME_STATE;
}



export type SessionActions =
  | SetGameState
  | CreateSession
  | UpdateSession
  | SetCreatedSession
  | SetUpdatedSession
  | SessionFail
  | LoadGame
  | LoadGameSuccess
  | LoadGameFail
  | ClearGameState;
