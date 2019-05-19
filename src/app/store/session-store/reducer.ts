import { SessionState, initialState } from './state';
import { ActionTypes, Actions } from './actions';


export function sessionReducer(state: SessionState = initialState, action: Actions): SessionState {
  switch (action.type) {

    case ActionTypes.SetSession:
      return { ...state, ...action.payload };

    case ActionTypes.ClearSessionState:
      return initialState;

    case ActionTypes.CreateSession:
    case ActionTypes.UpdateSession:
    case ActionTypes.SessionFail:
    case ActionTypes.SessionExit:
    case ActionTypes.SubscribeToSession:
    case ActionTypes.UnsubscribeFromSession:
      return state;
  }

  return state;
}
