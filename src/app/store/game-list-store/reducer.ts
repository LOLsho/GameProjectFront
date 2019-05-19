import { ActionTypes, Actions } from './actions';
import { GameListState, initialState, gameListAdapter } from './state';


export function gameListReducer(state: GameListState = initialState, action: Actions): GameListState {
  switch (action.type) {
    case ActionTypes.LoadGamesSuccess:
      return gameListAdapter.addAll(action.payload.gameList, { ...state, loaded: true });

    case ActionTypes.UpdateGameItemSuccess:
      return gameListAdapter.updateOne({
        id: action.payload.id,
        changes: action.payload.changes,
      }, state);

    case ActionTypes.ClearGameList:
      return gameListAdapter.removeAll({ ...state, loaded: false });

    case ActionTypes.LoadGames:
    case ActionTypes.UpdateGameItem:
    case ActionTypes.LoadGamesFail:
    case ActionTypes.UpdateGameItemFail:
      return state;
  }

  return state;
}
