import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { mergeMap } from 'rxjs/operators';
import * as gameInfoActions from './actions';
import { ClearGameInfoState } from './actions';
import { UnsubscribeFromSession } from '@store/session-store/actions';
import { UnsubscribeFromSessionList } from '@store/session-list-store/actions';
import { UnsubscribeFromSteps } from '@store/steps-store/actions';
import { UnsubscribeFromPlayers } from '@store/players-store/actions';


@Injectable()
export class GameInfoEffects {

  constructor(
    private actions$: Actions,
  ) {}

  @Effect()
  clearGameRelatedStates$: Observable<Action> = this.actions$.pipe(
    ofType(gameInfoActions.ActionTypes.ClearGameRelatedStates),
    mergeMap(() => [
      new ClearGameInfoState(),
      new UnsubscribeFromSession(),
      new UnsubscribeFromPlayers(),
      new UnsubscribeFromSessionList(),
      new UnsubscribeFromSteps(),
    ]),
  );
}
