import { Actions, ActionTypes } from './actions';
import { GameInfoState, initialState } from './state';


export function gameInfoReducer(state: GameInfoState = initialState, action: Actions): GameInfoState {
  switch (action.type) {

    case ActionTypes.SetGameInfo:
      return { ...state, ...action.payload };

    case ActionTypes.ClearGameInfoState:
      return initialState;

    case ActionTypes.ClearGameRelatedStates:
      return state;
  }

  return state;
}
