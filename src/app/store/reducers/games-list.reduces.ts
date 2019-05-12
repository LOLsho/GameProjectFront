import { GameItem } from '../../game-wrapper/game.interfaces';
import { GamesListActions, GamesListActionTypes } from '../actions/games-list.actions';
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
    case GamesListActionTypes.LoadGamesSuccess:
      return gameListAdapter.addAll(action.payload.gameList, { ...state, loaded: true });

    case GamesListActionTypes.UpdateGameItemSuccess:
      return gameListAdapter.updateOne({
        id: action.payload.id,
        changes: action.payload.changes,
      }, state);

    case GamesListActionTypes.ClearGameList:
      return gameListAdapter.removeAll({ ...state, loaded: false });

    case GamesListActionTypes.LoadGames:
    case GamesListActionTypes.UpdateGameItem:
    case GamesListActionTypes.LoadGamesFail:
    case GamesListActionTypes.UpdateGameItemFail:
      return state;
  }

  return state;
}


