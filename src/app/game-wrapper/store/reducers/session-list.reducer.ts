import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Session } from '../../game.interfaces';
import { SessionListActions, SessionListActionTypes } from '../actions/session-list.actions';


export interface SessionListState extends EntityState<Session> {
  loaded: boolean;
}

export function sortByDate(a: Session, b: Session): number {
  return b.created - a.created;
}

export const sessionListAdapter = createEntityAdapter<Session>({
  sortComparer: sortByDate,
});

export const initialSessionListState: SessionListState = sessionListAdapter.getInitialState({
  loaded: false,
});


export function sessionListReducer(
  state: SessionListState = initialSessionListState,
  action: SessionListActions,
): SessionListState {
  switch (action.type) {

    case SessionListActionTypes.SessionListLoaded:
      return { ...state, loaded: true };

    case SessionListActionTypes.AddOneSessionToList:
      return sessionListAdapter.addOne(action.payload, { ...state, loaded: true });

    case SessionListActionTypes.UpdateOneSessionInList:
      return sessionListAdapter.upsertOne(action.payload, { ...state, loaded: true });

    case SessionListActionTypes.RemoveOneSessionFromList:
      return sessionListAdapter.removeOne(action.payload.id, { ...state, loaded: true });

    case SessionListActionTypes.ClearSessionListState:
      return sessionListAdapter.removeAll({ ...state, loaded: false });

    case SessionListActionTypes.SubscribeToSessionList:
    case SessionListActionTypes.UnsubscribeFromSessionList:
      return state;
  }

  return state;
}
