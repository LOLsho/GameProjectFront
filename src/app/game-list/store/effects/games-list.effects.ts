import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { LOAD_GAMES, LoadGamesFail, LoadGamesSuccess } from '../actions/games-list.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GameListService } from '../../game-list.service';
import { GameList } from '../../../game-wrapper/game.interfaces';


@Injectable()
export class GamesListEffects {

  constructor(
    private actions$: Actions,
    private gameListService: GameListService,
  ) {}

  @Effect()
  getGameList$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_GAMES),
    switchMap(() => this.gameListService.getGameList()),
    map((gameList: GameList) => new LoadGamesSuccess(gameList)),
    catchError((error) => of(new LoadGamesFail(error)))
  );
}
