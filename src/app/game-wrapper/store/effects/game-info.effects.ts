// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Observable } from 'rxjs';
// import { Action } from '@ngrx/store';
// import { ClearGameInfoState, GameInfoActionTypes } from '../actions/game-info.actions';
// import { mergeMap } from 'rxjs/operators';
// import { UnsubscribeFromSession } from '../actions/session.actions';
// import { UnsubscribeFromSteps } from '../actions/steps.actions';
// import { UnsubscribeFromSessionList } from '../actions/session-list.actions';
//
//
// @Injectable()
// export class GameInfoEffects {
//
//   constructor(
//     private actions$: Actions,
//   ) {}
//
//   @Effect()
//   clearGameRelatedStates$: Observable<Action> = this.actions$.pipe(
//     ofType(GameInfoActionTypes.ClearGameRelatedStates),
//     mergeMap(() => [
//       new ClearGameInfoState(),
//       new UnsubscribeFromSession(),
//       new UnsubscribeFromSessionList(),
//       new UnsubscribeFromSteps(),
//     ]),
//   );
// }
