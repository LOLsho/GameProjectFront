import { ActionTypes, Actions } from './actions';
import { SessionListState, initialState, sessionListAdapter } from './state';


export function sessionListReducer(state: SessionListState = initialState, action: Actions): SessionListState {
  switch (action.type) {

    case ActionTypes.SessionListLoaded:
      return { ...state, loaded: true };

    case ActionTypes.AddOneSessionToList:
      return sessionListAdapter.addOne(action.payload, { ...state, loaded: true });

    case ActionTypes.UpdateOneSessionInList:
      return sessionListAdapter.upsertOne(action.payload, { ...state, loaded: true });

    case ActionTypes.RemoveOneSessionFromList:
      return sessionListAdapter.removeOne(action.payload.id, { ...state, loaded: true });

    case ActionTypes.ClearSessionListState:
      return sessionListAdapter.removeAll({ ...state, loaded: false });

    case ActionTypes.SubscribeToSessionList:
    case ActionTypes.UnsubscribeFromSessionList:
      return state;
  }

  return state;
}
