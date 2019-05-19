import { Action } from '@ngrx/store';
import { Session } from '../../game-wrapper/game.interfaces';


export enum ActionTypes {
  SetSession = '[FIRESTORE API] Set Session',
  CreateSession = '[GAME] Create New Game Session',

  UpdateSession = '[GAME] Update Session',

  SubscribeToSession = '[GAME] Subscribe To Session',
  UnsubscribeFromSession= '[GAME] Unsubscribe From Session',

  SessionFail = '[FIRESTORE API] Error working with session',

  SessionExit = '[GAME] Exit Session',
  ClearSessionState = '[SESSION EXIT] Clear Session State',
}


export class CreateSession implements Action {
  readonly type = ActionTypes.CreateSession;
  constructor(public payload: Session) {}
}

export class SetSession implements Action {
  readonly type = ActionTypes.SetSession;
  constructor(public payload: Session) {}
}

export class UpdateSession implements Action {
  readonly type = ActionTypes.UpdateSession;
  constructor(public payload: Partial<Session>) {}
}

export class SessionExit implements Action {
  readonly type = ActionTypes.SessionExit;
}

export class UnsubscribeFromSession implements Action {
  readonly type = ActionTypes.UnsubscribeFromSession;
}

export class ClearSessionState implements Action {
  readonly type = ActionTypes.ClearSessionState;
}

export class SessionFail implements Action {
  readonly type = ActionTypes.SessionFail;
  constructor(public payload: any) {}
}

export class SubscribeToSession implements Action {
  readonly type = ActionTypes.SubscribeToSession;
  constructor(public payload: { id: string }) {}
}



export type Actions =
  | SetSession
  | UpdateSession
  | CreateSession
  | ClearSessionState
  | SessionExit
  | SubscribeToSession
  | UnsubscribeFromSession
  | SessionFail;
