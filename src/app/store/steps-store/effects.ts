import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirestoreService, Query } from '../../services/firestore.service';
import { NotifierService } from 'angular-notifier';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { GameMode, Step } from '../../game-wrapper/game.interfaces';
import * as stepsActions from './actions';
import { selectGameMode } from '@store/game-info-store/selectors';
import { AppState } from '@store/state';
import { selectLastStep } from '@store/steps-store/selectors';


const serverLatency = environment.approximateServerLatency;


@Injectable()
export class StepsEffects {

  unsubscribeFromSteps$: Subject<void>;

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  loadSteps$: Observable<Action> = this.actions$.pipe(
    ofType(stepsActions.ActionTypes.LoadSteps),
    map((action: stepsActions.SubscribeToSteps) => action.payload.sessionId),
    switchMap((sessionId: string) => this.firestoreService.getStepsCollection(sessionId).get().pipe(
      map((res: any): Step[] => {
        return res.docs.map((item) => {
          const stepData = item.data();
          stepData.timestamp = stepData.timestamp.toMillis();
          const stepId = item.id;
          return { ...stepData, id: stepId };
        });
      }),
      withLatestFrom(this.store$.select(selectGameMode)),
      mergeMap(([steps, gameMode]: [Step[], GameMode]) => {
        const actionsToDispatch: Action[] = [
          new stepsActions.StepsLoaded(steps),
        ];

        if (gameMode === 'multiplayer') {
          actionsToDispatch.push(new stepsActions.SubscribeToSteps({sessionId}));
        }

        return actionsToDispatch;
      }),
      catchError((error) => of(new stepsActions.StepsFail(error))),
    )),
  );

  @Effect()
  subscribeToSteps$: Observable<Action> = this.actions$.pipe(
    ofType(stepsActions.ActionTypes.SubscribeToSteps),
    tap(() => this.unsubscribeFromSteps$ = new Subject()),
    withLatestFrom(this.store$.select(selectLastStep)),
    map(([action, lastStep]: [stepsActions.SubscribeToSteps, Step]) => {
      let timestamp;
      if (lastStep) {
        timestamp = this.firestoreService.getTimestampFromDate(lastStep.timestamp);
      } else {
        timestamp = this.firestoreService.getTimestampFromDate(Date.now() - serverLatency);
      }
      const query: Query = { where: [{ field: 'timestamp', opStr: '>', value: timestamp }] };
      return [action.payload.sessionId, query];
    }),
    switchMap(([sessionId, query]: [string, Query]) => {
      return this.firestoreService.getStepsCollection(sessionId, query).stateChanges().pipe(
        takeUntil(this.unsubscribeFromSteps$),
        mergeMap((actions) => actions),
        map((res: any) => {
          const stepData = res.payload.doc.data();
          stepData.timestamp = stepData.timestamp.toMillis();
          const stepId = res.payload.doc.id;
          const step: Step = { ...stepData, id: stepId };
          return { step: step, action: res.type };
        }),
        map(({ step, action }) => {
          switch (action) {
            case 'added':
              return new stepsActions.StepMade(step);
            case 'removed':
            // return new StepCanceled(step); // TODO later
          }
        }),
        catchError((error) => of(new stepsActions.StepsFail(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  makeStep$: Observable<Action> = this.actions$.pipe(
    ofType(stepsActions.ActionTypes.MakeStep),
    map((action: stepsActions.MakeStep) => action.payload),
    switchMap((payload: any) => this.firestoreService.addGameStep(payload.step, payload.sessionId).pipe(
      catchError((error) => of(new stepsActions.StepsFail(error))),
    )),
  );

  @Effect()
  stepsUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(stepsActions.ActionTypes.UnsubscribeFromSteps),
    tap(() => {
      if (this.unsubscribeFromSteps$) {
        this.unsubscribeFromSteps$.next();
        this.unsubscribeFromSteps$.complete();
      }
    }),
    map(() => new stepsActions.ClearStepsState()),
  );

  @Effect({ dispatch: false })
  onStepsError$ = this.actions$.pipe(
    ofType(stepsActions.ActionTypes.StepsFail),
    map((action: stepsActions.StepsFail) => action.payload),
    tap((error: any) => {
      console.error('Error in STEPS effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
