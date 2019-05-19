import { Action } from '@ngrx/store';
import { GameItem, GameList } from '../../game-wrapper/game.interfaces';


export enum ActionTypes {
  LoadGames = '[Game List Page] Load Games',
  LoadGamesSuccess = '[Game List API] Load Games Success',
  LoadGamesFail = '[Game List API] Load Games Fail',

  UpdateGameItem = '[Game List Page] Update Game Item',
  UpdateGameItemSuccess = '[Game List API] Update Game Item Success',
  UpdateGameItemFail = '[Game List API] Update Game Item Fail',

  ClearGameList = '[On Logout] Clear Game List',
}


export class LoadGames implements Action {
  readonly type = ActionTypes.LoadGames;
}

export class LoadGamesSuccess implements Action {
  readonly type = ActionTypes.LoadGamesSuccess;
  constructor(public payload: { gameList: GameList }) {}
}

export class LoadGamesFail implements Action {
  readonly type = ActionTypes.LoadGamesFail;
  constructor(public payload: any) {}
}

export class UpdateGameItem {
  readonly type = ActionTypes.UpdateGameItem;
  constructor(
    public payload: {
      id: string,
      changes: Partial<GameItem>
    },
  ) {}
}

export class UpdateGameItemSuccess implements Action {
  readonly type = ActionTypes.UpdateGameItemSuccess;
  constructor(
    public payload: {
      id: string,
      changes: Partial<GameItem>
    },
  ) {}
}

export class UpdateGameItemFail implements Action {
  readonly type = ActionTypes.UpdateGameItemFail;
  constructor(public payload: any) {}
}

export class ClearGameList implements Action {
  readonly type = ActionTypes.ClearGameList;
}


export type Actions =
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | UpdateGameItem
  | UpdateGameItemSuccess
  | UpdateGameItemFail
  | ClearGameList;
