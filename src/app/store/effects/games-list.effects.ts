import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  GamesListActionTypes,
  LoadGamesFail,
  LoadGamesSuccess,
  UpdateGameItem, UpdateGameItemFail, UpdateGameItemSuccess,
} from '../actions/games-list.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GameList } from '../../game-wrapper/game.interfaces';
import { fromPromise } from 'rxjs/internal-compatibility';
import { NotifierService } from 'angular-notifier';
import { FirestoreService } from '../../services/firestore.service';


@Injectable()
export class GamesListEffects {

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  getGameList$: Observable<Action> = this.actions$.pipe(
    ofType(GamesListActionTypes.LoadGames),
    switchMap(() => this.firestoreService.getGameListChanges().pipe(
      map((actions: any) => actions.map((item: any) => {
        const data = item.payload.doc.data();
        const id = item.payload.doc.id;
        return {...data, id};
      })),
      map((gameList: GameList) => new LoadGamesSuccess({gameList})),
      catchError((error: any) => of(new LoadGamesFail(error)))
    )),
  );

  @Effect()
  updateGameList$: Observable<Action> = this.actions$.pipe(
    ofType(GamesListActionTypes.UpdateGameItem),
    map((action: UpdateGameItem) => action.payload),
    switchMap((data) => {
      return fromPromise(
        this.firestoreService.getGameDocument().update(data.changes)
      ).pipe(
        map(() => new UpdateGameItemSuccess(data)),
        catchError((error: any) => of(new UpdateGameItemFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  catchErrors$ = this.actions$.pipe(
    ofType(GamesListActionTypes.LoadGamesFail, GamesListActionTypes.UpdateGameItemFail),
    map((action: UpdateGameItem) => action.payload),
    tap((error: any) => {
      console.log('Error loading or updating game list:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
