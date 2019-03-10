import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Session } from '../../game.interfaces';
import {
  ADD_ONE_SESSION_TO_LIST, CLEAR_SESSION_LIST_STATE, REMOVE_ONE_SESSION_FROM_LIST, SESSION_LIST_LOADED,
  SessionListActions,
  SUBSCRIBE_TO_SESSION_LIST, UNSUBSCRIBE_FROM_SESSION_LIST, UPDATE_ONE_SESSION_IN_LIST,
} from '../actions/session-list.actions';


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

    case SESSION_LIST_LOADED:
      return { ...state, loaded: true };

    case ADD_ONE_SESSION_TO_LIST:
      return sessionListAdapter.addOne(action.payload, { ...state, loaded: true });

    case UPDATE_ONE_SESSION_IN_LIST:
      return sessionListAdapter.upsertOne(action.payload, { ...state, loaded: true });

    case REMOVE_ONE_SESSION_FROM_LIST:
      return sessionListAdapter.removeOne(action.payload.id, { ...state, loaded: true });

    case CLEAR_SESSION_LIST_STATE:
      return sessionListAdapter.removeAll({ ...state, loaded: false });

    case SUBSCRIBE_TO_SESSION_LIST:
    case UNSUBSCRIBE_FROM_SESSION_LIST:
      return state;
  }

  return state;
}
