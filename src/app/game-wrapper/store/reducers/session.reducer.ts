import { GameSettings } from '../../game.interfaces';
import {
  CLEAR_GAME_STATE,
  CREATE_SESSION,
  SessionActions, SESSION_FAIL, SET_CREATED_SESSION, SET_GAME_STATE, SET_UPDATED_SESSION, UPDATE_SESSION,
} from '../actions/session.actions';


export interface GameState {
  id: string;
  name: string;
  session: any;
  // chat
}

export const initialGameState: GameState = {
  id: null,
  name: null,
  session: null,
};


export function sessionReducer(
  state: GameState = initialGameState,
  action: SessionActions,
): GameState {

  switch (action.type) {

    case SET_GAME_STATE:
      return { ...state, ...action.payload };

    case SET_CREATED_SESSION:
      return { ...state, session: action.payload.session };

    case SET_UPDATED_SESSION:
      return {
        ...state,
        session: { ...state.session, ...action.payload.updatedSessionData },
      };

    case CREATE_SESSION:
    case UPDATE_SESSION:
    case SESSION_FAIL:
      return { ...state };

    case CLEAR_GAME_STATE:
      return { ...initialGameState };
  }

  return state;
}
