import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, Subject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  ClearStepsState,
  MakeStep,
  StepMade, StepsActionTypes, StepsFail, StepsLoaded,
  SubscribeToSteps,
} from '../actions/steps.actions';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService } from '../../../services/firestore.service';
import { GameMode, Step } from '../../game.interfaces';
import { AppState } from '../../../store/reducers';
import { selectLastStep } from '../selectors/steps.selectors';
import { selectGameMode } from '../selectors/game-info.selectors';
import { UpdateGameItem } from '../../../store/actions/games-list.actions';
import { NotifierService } from 'angular-notifier';


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
    ofType(StepsActionTypes.LoadSteps),
    map((action: SubscribeToSteps) => action.payload.sessionId),
    switchMap((sessionId: string) => this.firestoreService.getStepsCollection(sessionId).get().pipe(
      map((res: any): Step[] => {
        return res.docs.map((item) => {
          const stepData = item.data();
          stepData.timestamp = stepData.timestamp.toDate();
          const stepId = item.id;
          return { ...stepData, id: stepId };
        });
      }),
      withLatestFrom(this.store$.select(selectGameMode)),
      mergeMap(([steps, gameMode]: [Step[], GameMode]) => {
        const actionsToDispatch: Action[] = [
          new StepsLoaded(steps),
        ];

        if (gameMode === 'multiplayer') actionsToDispatch.push(new SubscribeToSteps({sessionId}));

        return actionsToDispatch;
      }),
      catchError((error) => of(new StepsFail(error))),
    )),
  );

  @Effect()
  subscribeToSteps$: Observable<Action> = this.actions$.pipe(
    ofType(StepsActionTypes.SubscribeToSteps),
    tap(() => this.unsubscribeFromSteps$ = new Subject()),
    withLatestFrom(this.store$.select(selectLastStep)),
    map(([action, lastStep]: [SubscribeToSteps, Step]) => {
      let query = {};
      if (lastStep) {
        query = {
          where: [{ field: 'timestamp', opStr: '>', value: lastStep.timestamp }]
        };
      }
      return [action.payload.sessionId, query];
    }),
    switchMap(([sessionId, query]: [string, any]) => {
      return this.firestoreService.getStepsCollection(sessionId, query).stateChanges().pipe(
        takeUntil(this.unsubscribeFromSteps$),
        mergeMap((actions) => actions),
        map((res: any) => {
          const stepData = res.payload.doc.data();
          stepData.timestamp = stepData.timestamp.toDate();
          const stepId = res.payload.doc.id;
          const step: Step = { ...stepData, id: stepId };
          return { step, action: res.type };
        }),
        map(({ step, action }) => {
          switch (action) {
            case 'added':
              return new StepMade(step);
            case 'removed':
            // return new StepCanceled(step); // TODO later
          }
        }),
        catchError((error) => of(new StepsFail(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  makeStep$: Observable<Action> = this.actions$.pipe(
    ofType(StepsActionTypes.MakeStep),
    map((action: MakeStep) => action.payload),
    switchMap((payload: any) => this.firestoreService.addGameStep(payload.step, payload.sessionId).pipe(
      catchError((error) => of(new StepsFail(error))),
    ))
  );

  @Effect()
  stepsUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(StepsActionTypes.UnsubscribeFromSteps),
    tap(() => {
      if (this.unsubscribeFromSteps$) {
        this.unsubscribeFromSteps$.next();
        this.unsubscribeFromSteps$.complete();
      }
    }),
    map(() => new ClearStepsState()),
  );

  @Effect({ dispatch: false })
  onStepsError$ = this.actions$.pipe(
    ofType(StepsActionTypes.StepsFail),
    map((action: UpdateGameItem) => action.payload),
    tap((error: any) => {
      console.log('Error caught in STEPS effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
