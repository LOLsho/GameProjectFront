import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CLEAR_APP_STATE } from '../actions/app.actions';
import { mergeMap } from 'rxjs/operators';
import { ClearGameList } from '../actions/games-list.actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
  ) {}

  @Effect()
  $clearAppState: Observable<Action> = this.actions$.pipe(
    ofType(CLEAR_APP_STATE),
    mergeMap(() => [
      new ClearGameList(),
    ]),
  );
}
