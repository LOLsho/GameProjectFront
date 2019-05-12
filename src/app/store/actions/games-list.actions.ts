import { Action } from '@ngrx/store';
import { GameItem, GameList } from '../../game-wrapper/game.interfaces';


export enum GamesListActionTypes {
  LoadGames = '[Game List Page] Load Games',
  LoadGamesSuccess = '[Game List API] Load Games Success',
  LoadGamesFail = '[Game List API] Load Games Fail',

  UpdateGameItem = '[Game List Page] Update Game Item',
  UpdateGameItemSuccess = '[Game List API] Update Game Item Success',
  UpdateGameItemFail = '[Game List API] Update Game Item Fail',

  ClearGameList = '[On Logout] Clear Game List',
}


export class LoadGames implements Action {
  readonly type = GamesListActionTypes.LoadGames;
}

export class LoadGamesSuccess implements Action {
  readonly type = GamesListActionTypes.LoadGamesSuccess;
  constructor(public payload: { gameList: GameList }) {}
}

export class LoadGamesFail implements Action {
  readonly type = GamesListActionTypes.LoadGamesFail;
  constructor(public payload: any) {}
}

export class UpdateGameItem {
  readonly type = GamesListActionTypes.UpdateGameItem;
  constructor(
    public payload: {
      id: string,
      changes: Partial<GameItem>
    },
  ) {}
}

export class UpdateGameItemSuccess implements Action {
  readonly type = GamesListActionTypes.UpdateGameItemSuccess;
  constructor(
    public payload: {
      id: string,
      changes: Partial<GameItem>
    },
  ) {}
}

export class UpdateGameItemFail implements Action {
  readonly type = GamesListActionTypes.UpdateGameItemFail;
  constructor(public payload: any) {}
}

export class ClearGameList implements Action {
  readonly type = GamesListActionTypes.ClearGameList;
}



export type GamesListActions =
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | UpdateGameItem
  | UpdateGameItemSuccess
  | UpdateGameItemFail
  | ClearGameList;
