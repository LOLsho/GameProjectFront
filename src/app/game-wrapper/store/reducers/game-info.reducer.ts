import { GameInfoActions, GameInfoActionTypes } from '../actions/game-info.actions';
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

    case GameInfoActionTypes.SetGameInfo:
      return { ...state, ...action.payload };

    case GameInfoActionTypes.ClearGameInfoState:
      return initialGameInfoState;

    case GameInfoActionTypes.ClearGameRelatedStates:
      return state;
  }

  return state;
}
