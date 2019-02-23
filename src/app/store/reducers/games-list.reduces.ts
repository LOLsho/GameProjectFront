import { GameList } from '../../game-wrapper/game.interfaces';
import { GamesListActions, LOAD_GAMES, LOAD_GAMES_FAIL, LOAD_GAMES_SUCCESS } from '../actions/games-list.actions';


export interface GameListState {
  gameList: GameList;
}

export const initialGamesListState: GameListState = {
  gameList: null,
};


export function gameListReducer(
  state: GameListState = initialGamesListState,
  action: GamesListActions
): GameListState {
  switch (action.type) {
    case LOAD_GAMES_SUCCESS:
      return { ...state, gameList: action.payload };
    case LOAD_GAMES:
    case LOAD_GAMES_FAIL:
      return state;
  }

  return state;
}

export const selectGameList = (state: GameListState) => state.gameList;
