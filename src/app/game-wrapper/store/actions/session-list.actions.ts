import { Action } from '@ngrx/store';
import { Session } from '../../game.interfaces';



export const SUBSCRIBE_TO_SESSION_LIST = '[GAME] Subscribe To Session List';
export const UNSUBSCRIBE_FROM_SESSION_LIST = '[GAME] Unsubscribe From Session List';

export const SESSION_LIST_LOADED = '[FIRESTORE API] Session List Loaded';
export const ADD_ONE_SESSION_TO_LIST = '[FIRESTORE API] Add One Session To List';
export const UPDATE_ONE_SESSION_IN_LIST = '[FIRESTORE API] Update One Session In List';
export const REMOVE_ONE_SESSION_FROM_LIST = '[FIRESTORE API] Remove One Session From List';

export const CLEAR_SESSION_LIST_STATE = '[SESSION LIST EXIT] Clear Session List State';



export class SubscribeToSessionList implements Action {
  readonly type = SUBSCRIBE_TO_SESSION_LIST;
  constructor(public payload: any) {}
}

export class SessionListLoaded implements Action {
  readonly type = SESSION_LIST_LOADED;
}

export class UnsubscribeFromSessionList implements Action {
  readonly type = UNSUBSCRIBE_FROM_SESSION_LIST;
}

export class AddOneSessionToList implements Action {
  readonly type = ADD_ONE_SESSION_TO_LIST;
  constructor(public payload: Session) {}
}

export class UpdateOneSessionInList implements Action {
  readonly type = UPDATE_ONE_SESSION_IN_LIST;
  constructor(public payload: Session) {}
}

export class RemoveOneSessionFromList implements Action {
  readonly type = REMOVE_ONE_SESSION_FROM_LIST;
  constructor(public payload: Session) {}
}

export class ClearSessionListState implements Action {
  readonly type = CLEAR_SESSION_LIST_STATE;
}



export type SessionListActions =
  | SubscribeToSessionList
  | SessionListLoaded
  | UpdateOneSessionInList
  | RemoveOneSessionFromList
  | ClearSessionListState
  | UnsubscribeFromSessionList
  | AddOneSessionToList;
