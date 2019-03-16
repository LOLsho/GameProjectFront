import {
  CLEAR_GAME_INFO_STATE,
  CLEAR_GAME_RELATED_STATES,
  GameInfoActions,
  SET_GAME_INFO,
} from '../actions/game-info.actions';
import { GameMode } from '../../game.interfaces';


export interface GameInfoState {
  id: string;
  name: string;
  gameMode: GameMode;
}

export const initialGameInfoState: GameInfoState = {
  id: null,
  name: null,
  gameMode: null,
};


export function gameInfoReducer(
  state: GameInfoState = initialGameInfoState,
  action: GameInfoActions): GameInfoState {
  switch (action.type) {

    case SET_GAME_INFO:
      return { ...state, ...action.payload };

    case CLEAR_GAME_INFO_STATE:
      return initialGameInfoState;

    case CLEAR_GAME_RELATED_STATES:
      return state;
  }

  return state;
}
