// import { Session } from '../../game.interfaces';
// import { SessionActions, SessionActionTypes } from '../actions/session.actions';
//
//
// export type SessionState = Session;
//
// export const initialSessionState: SessionState = {
//   id: null,
//   created: null,
//   creatorId: null,
//   gameData: null,
//   gameMode: null,
//   isSessionOver: null,
// };
//
//
// export function sessionReducer(
//   state: SessionState = initialSessionState,
//   action: SessionActions
// ): SessionState {
//   switch (action.type) {
//
//     case SessionActionTypes.SetSession:
//       return { ...state, ...action.payload };
//
//     case SessionActionTypes.ClearSessionState:
//       return initialSessionState;
//
//     case SessionActionTypes.CreateSession:
//     case SessionActionTypes.UpdateSession:
//     case SessionActionTypes.SessionFail:
//     case SessionActionTypes.SessionExit:
//     case SessionActionTypes.SubscribeToSession:
//     case SessionActionTypes.UnsubscribeFromSession:
//       return state;
//   }
//
//   return state;
// }
