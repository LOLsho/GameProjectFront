import { Action } from '@ngrx/store';
import { Session } from '../../game.interfaces';


export const SET_SESSION = '[FIRESTORE API] Set Session';
export const CREATE_SESSION = '[GAME] Create New Game Session';

export const UPDATE_SESSION = '[GAME] Update Session';

export const SUBSCRIBE_TO_SESSION = '[GAME] Subscribe To Session';
export const UNSUBSCRIBE_FROM_SESSION = '[GAME] Unsubscribe From Session';

export const SESSION_FAIL = '[FIRESTORE API] Error working with session';

export const SESSION_EXIT = '[GAME] Exit Session';
export const CLEAR_SESSION_STATE = '[SESSION EXIT] Clear Session State';



export class CreateSession implements Action {
  readonly type = CREATE_SESSION;
  constructor(public payload: Session) {}
}

export class SetSession implements Action {
  readonly type = SET_SESSION;
  constructor(public payload: Session) {}
}

export class UpdateSession implements Action {
  readonly type = UPDATE_SESSION;
  constructor(public payload: Partial<Session>) {}
}

export class SessionExit implements Action {
  readonly type = SESSION_EXIT;
}

export class UnsubscribeFromSession implements Action {
  readonly type = UNSUBSCRIBE_FROM_SESSION;
}

export class ClearSessionState implements Action {
  readonly type = CLEAR_SESSION_STATE;
}

export class SessionFail implements Action {
  readonly type = SESSION_FAIL;
  constructor(public payload: any) {}
}

export class SubscribeToSession implements Action {
  readonly type = SUBSCRIBE_TO_SESSION;
  constructor(public payload: { id: string }) {}
}



export type SessionActions =
  | SetSession
  | UpdateSession
  | CreateSession
  | ClearSessionState
  | SessionExit
  | SubscribeToSession
  | UnsubscribeFromSession
  | SessionFail;
