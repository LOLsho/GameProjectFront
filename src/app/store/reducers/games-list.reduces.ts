import { GameItem } from '../../game-wrapper/game.interfaces';
import {
  CLEAR_GAME_LIST,
  GamesListActions,
  LOAD_GAMES,
  LOAD_GAMES_FAIL,
  LOAD_GAMES_SUCCESS, UPDATE_GAME_ITEM, UPDATE_GAME_ITEM_FAIL, UPDATE_GAME_ITEM_SUCCESS,
} from '../actions/games-list.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


export interface GameListState extends EntityState<GameItem> {
  loaded: boolean;
}

export const gameListAdapter: EntityAdapter<GameItem> = createEntityAdapter<GameItem>();

export const initialGamesListState: GameListState = gameListAdapter.getInitialState({
  loaded: false,
});



export function gameListReducer(
  state: GameListState = initialGamesListState,
  action: GamesListActions
): GameListState {
  switch (action.type) {
    case LOAD_GAMES_SUCCESS:
      return gameListAdapter.addAll(action.payload.gameList, { ...state, loaded: true });

    case UPDATE_GAME_ITEM_SUCCESS:
      return gameListAdapter.updateOne({
        id: action.payload.id,
        changes: action.payload.changes,
      }, state);

    case CLEAR_GAME_LIST:
      return gameListAdapter.removeAll({ ...state, loaded: false });

    case LOAD_GAMES:
    case UPDATE_GAME_ITEM:
    case LOAD_GAMES_FAIL:
    case UPDATE_GAME_ITEM_FAIL:
      return state;
  }

  return state;
}


