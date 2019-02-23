import { Action } from '@ngrx/store';
import { GameList } from '../../game-wrapper/game.interfaces';



export const LOAD_GAMES = '[GAME_LIST] Load Games';
export const LOAD_GAMES_SUCCESS = '[GAME_LIST] Load Games Success';
export const LOAD_GAMES_FAIL = '[GAME_LIST] Load Games Fail';


export class LoadGames implements Action {
  readonly type = LOAD_GAMES;
}

export class LoadGamesSuccess implements Action {
  readonly type = LOAD_GAMES_SUCCESS;
  constructor(public payload: GameList) {}
}

export class LoadGamesFail implements Action {
  readonly type = LOAD_GAMES_FAIL;
  constructor(public payload: any) {}
}



export type GamesListActions =
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail;
