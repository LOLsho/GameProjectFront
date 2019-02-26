import { Action } from '@ngrx/store';
import { GameItem, GameList } from '../../game-wrapper/game.interfaces';
import { Update } from '@ngrx/entity';



export const LOAD_GAMES = '[Game List Page] Load Games';
export const LOAD_GAMES_SUCCESS = '[Game List API] Load Games Success';
export const LOAD_GAMES_FAIL = '[Game List API] Load Games Fail';

export const UPDATE_GAME_ITEM = '[Game List Page] Update Game Item';
export const UPDATE_GAME_ITEM_SUCCESS = '[Game List API] Update Game Item Success';
export const UPDATE_GAME_ITEM_FAIL = '[Game List API] Update Game Item Fail';

export const CLEAR_GAME_LIST = '[On Logout] Clear Game List';



export class LoadGames implements Action {
  readonly type = LOAD_GAMES;
}

export class LoadGamesSuccess implements Action {
  readonly type = LOAD_GAMES_SUCCESS;
  constructor(public payload: { gameList: GameList }) {}
}

export class LoadGamesFail implements Action {
  readonly type = LOAD_GAMES_FAIL;
  constructor(public payload: any) {}
}

export class UpdateGameItem {
  readonly type = UPDATE_GAME_ITEM;
  constructor(
    public payload: {
      id: string,
      changes: Partial<GameItem>
    },
  ) {}
}

export class UpdateGameItemSuccess implements Action {
  readonly type = UPDATE_GAME_ITEM_SUCCESS;
  constructor(
    public payload: {
      id: string,
      changes: Partial<GameItem>
    },
  ) {}
}

export class UpdateGameItemFail implements Action {
  readonly type = UPDATE_GAME_ITEM_FAIL;
  constructor(public payload: any) {}
}

export class ClearGameList implements Action {
  readonly type = CLEAR_GAME_LIST;
}



export type GamesListActions =
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | UpdateGameItem
  | UpdateGameItemSuccess
  | UpdateGameItemFail
  | ClearGameList;
