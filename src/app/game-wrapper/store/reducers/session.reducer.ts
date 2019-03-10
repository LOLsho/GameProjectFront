import { Session } from '../../game.interfaces';
import {
  CLEAR_SESSION_STATE,
  CREATE_SESSION, SESSION_EXIT, SESSION_FAIL,
  SessionActions, SET_SESSION, SUBSCRIBE_TO_SESSION, UNSUBSCRIBE_FROM_SESSION,
  UPDATE_SESSION,
} from '../actions/session.actions';


export type SessionState = Session;

export const initialSessionState: SessionState = {
  id: null,
  created: null,
  creatorId: null,
  gameData: null,
  gameMode: null,
  isSessionOver: null,
};


export function sessionReducer(
  state: SessionState = initialSessionState,
  action: SessionActions
): SessionState {
  switch (action.type) {

    case SET_SESSION:
      return { ...state, ...action.payload };

    case CLEAR_SESSION_STATE:
      return initialSessionState;

    case CREATE_SESSION:
    case UPDATE_SESSION:
    case SESSION_FAIL:
    case SESSION_EXIT:
    case SUBSCRIBE_TO_SESSION:
    case UNSUBSCRIBE_FROM_SESSION:
      return state;
  }

  return state;
}
