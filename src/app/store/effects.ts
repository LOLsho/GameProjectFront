import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { mergeMap } from 'rxjs/operators';
import * as appActions from './actions';
import { ClearGameList } from '@store/game-list-store/actions';


@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
  ) {}

  @Effect()
  $clearAppState: Observable<Action> = this.actions$.pipe(
    ofType(appActions.ActionTypes.ClearAppState),
    mergeMap(() => [
      new ClearGameList(),
    ]),
  );
}
