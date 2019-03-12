import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { mergeMap } from 'rxjs/operators';
import { ClearGameList } from '../actions/games-list.actions';
import { AppActionTypes } from '../actions/app.actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
  ) {}

  @Effect()
  $clearAppState: Observable<Action> = this.actions$.pipe(
    ofType(AppActionTypes.ClearAppState),
    mergeMap(() => [
      new ClearGameList(),
    ]),
  );
}
