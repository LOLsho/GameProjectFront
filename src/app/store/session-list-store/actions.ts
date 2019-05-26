import { Action } from '@ngrx/store';
import { Session } from '../../game-wrapper/game.interfaces';


export enum ActionTypes {
  SubscribeToSessionList = '[GAME] Subscribe To Session List',
  UnsubscribeFromSessionList = '[GAME] Unsubscribe From Session List',

  SessionListLoaded = '[FIRESTORE API] Session List Loaded',
  AddOneSessionToList = '[FIRESTORE API] Add One Session To List',
  UpdateOneSessionInList = '[FIRESTORE API] Update One Session In List',
  RemoveOneSessionFromList = '[FIRESTORE API] Remove One Session From List',

  ClearSessionListState = '[SESSION LIST EXIT] Clear Session List State',

  SessionListFail = '[FIRESTORE API] Session List Failed',
}


export class SubscribeToSessionList implements Action {
  readonly type = ActionTypes.SubscribeToSessionList;
  constructor(public payload: any) {}
}

export class SessionListLoaded implements Action {
  readonly type = ActionTypes.SessionListLoaded;
}

export class UnsubscribeFromSessionList implements Action {
  readonly type = ActionTypes.UnsubscribeFromSessionList;
}

export class AddOneSessionToList implements Action {
  readonly type = ActionTypes.AddOneSessionToList;
  constructor(public payload: Session) {}
}

export class UpdateOneSessionInList implements Action {
  readonly type = ActionTypes.UpdateOneSessionInList;
  constructor(public payload: Session) {}
}

export class RemoveOneSessionFromList implements Action {
  readonly type = ActionTypes.RemoveOneSessionFromList;
  constructor(public payload: Session) {}
}

export class ClearSessionListState implements Action {
  readonly type = ActionTypes.ClearSessionListState;
}

export class SessionListFail implements Action {
  readonly type = ActionTypes.SessionListFail;
  constructor(public payload: any) {}
}



export type Actions =
  | SubscribeToSessionList
  | SessionListLoaded
  | UpdateOneSessionInList
  | RemoveOneSessionFromList
  | ClearSessionListState
  | UnsubscribeFromSessionList
  | SessionListFail
  | AddOneSessionToList;
