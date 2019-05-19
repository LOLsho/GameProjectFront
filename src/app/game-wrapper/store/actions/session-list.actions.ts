// import { Action } from '@ngrx/store';
// import { Session } from '../../game.interfaces';
//
//
// export enum SessionListActionTypes {
//   SubscribeToSessionList = '[GAME] Subscribe To Session List',
//   UnsubscribeFromSessionList= '[GAME] Unsubscribe From Session List',
//
//   SessionListLoaded= '[FIRESTORE API] Session List Loaded',
//   AddOneSessionToList = '[FIRESTORE API] Add One Session To List',
//   UpdateOneSessionInList = '[FIRESTORE API] Update One Session In List',
//   RemoveOneSessionFromList = '[FIRESTORE API] Remove One Session From List',
//
//   ClearSessionListState = '[SESSION LIST EXIT] Clear Session List State',
//
//   SessionListFail = '[FIRESTORE API] Session List Failed',
// }
//
//
// export class SubscribeToSessionList implements Action {
//   readonly type = SessionListActionTypes.SubscribeToSessionList;
//   constructor(public payload: any) {}
// }
//
// export class SessionListLoaded implements Action {
//   readonly type = SessionListActionTypes.SessionListLoaded;
// }
//
// export class UnsubscribeFromSessionList implements Action {
//   readonly type = SessionListActionTypes.UnsubscribeFromSessionList;
// }
//
// export class AddOneSessionToList implements Action {
//   readonly type = SessionListActionTypes.AddOneSessionToList;
//   constructor(public payload: Session) {}
// }
//
// export class UpdateOneSessionInList implements Action {
//   readonly type = SessionListActionTypes.UpdateOneSessionInList;
//   constructor(public payload: Session) {}
// }
//
// export class RemoveOneSessionFromList implements Action {
//   readonly type = SessionListActionTypes.RemoveOneSessionFromList;
//   constructor(public payload: Session) {}
// }
//
// export class ClearSessionListState implements Action {
//   readonly type = SessionListActionTypes.ClearSessionListState;
// }
//
// export class SessionListFail implements Action {
//   readonly type = SessionListActionTypes.SessionListFail;
//   constructor(public payload: any) {}
// }
//
//
//
// export type SessionListActions =
//   | SubscribeToSessionList
//   | SessionListLoaded
//   | UpdateOneSessionInList
//   | RemoveOneSessionFromList
//   | ClearSessionListState
//   | UnsubscribeFromSessionList
//   | SessionListFail
//   | AddOneSessionToList;
