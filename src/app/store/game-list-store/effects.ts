import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FirestoreService } from '../../services/firestore.service';
import { NotifierService } from 'angular-notifier';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GameList } from '../../game-wrapper/game.interfaces';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as gameListActions from './actions';


@Injectable()
export class GamesListEffects {

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  getGameList$: Observable<Action> = this.actions$.pipe(
    ofType(gameListActions.ActionTypes.LoadGames),
    switchMap(() => this.firestoreService.getGameListChanges().pipe(
      map((actions: any) => actions.map((item: any) => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        return {...data, id};
      })),
      map((gameList: GameList) => new gameListActions.LoadGamesSuccess({gameList})),
      catchError((error: any) => of(new gameListActions.LoadGamesFail(error))),
    )),
  );

  @Effect()
  updateGameList$: Observable<Action> = this.actions$.pipe(
    ofType(gameListActions.ActionTypes.UpdateGameItem),
    map((action: gameListActions.UpdateGameItem) => action.payload),
    switchMap((data) => {
      return fromPromise(
        this.firestoreService.getGameDocument().update(data.changes)
      ).pipe(
        map(() => new gameListActions.UpdateGameItemSuccess(data)),
        catchError((error: any) => of(new gameListActions.UpdateGameItemFail(error))),
      );
    })
  );

  @Effect({ dispatch: false })
  catchErrors$ = this.actions$.pipe(
    ofType(gameListActions.ActionTypes.LoadGamesFail, gameListActions.ActionTypes.UpdateGameItemFail),
    map((action: any) => action.payload),
    tap((error: any) => {
      console.log('Error loading or updating game list:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
