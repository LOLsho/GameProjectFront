import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirestoreService } from '../../services/firestore.service';
import { NotifierService } from 'angular-notifier';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { GameMode, Session } from '../../game-wrapper/game.interfaces';
import * as sessionActions from './actions';
import { AppState } from '@store/state';
import { selectGameMode } from '@store/game-info-store/selectors';
import { LoadSteps, UnsubscribeFromSteps } from '@store/steps-store/actions';
import { UnsubscribeFromPlayers } from '@store/players-store/actions';


@Injectable()
export class SessionEffects {

  unsubscribeFromSession$: Subject<void>;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  subscribeToSession$: Observable<Action> = this.actions$.pipe(
    ofType(sessionActions.ActionTypes.SubscribeToSession),
    tap(() => this.unsubscribeFromSession$ = new Subject()),
    map((action: sessionActions.SubscribeToSession) => action.payload.id),
    switchMap((sessionId: string) => {
      return this.firestoreService.getSessionDocument(sessionId).valueChanges().pipe(
        takeUntil(this.unsubscribeFromSession$),
        map((session: Session): Session => ({ ...session, id: sessionId})),
        map((session: Session) => new sessionActions.SetSession(session)),
      );
    }),
  );

  @Effect()
  createNewSession$: Observable<Action> = this.actions$.pipe(
    ofType(sessionActions.ActionTypes.CreateSession),
    map((action: sessionActions.CreateSession) => action.payload),
    switchMap((createdSession: Session) => this.firestoreService.createNewGameSession(createdSession).pipe(
      map((docRef) => ({ ...createdSession, id: docRef.id })),
      withLatestFrom(this.store.select(selectGameMode)),
      mergeMap(([session, gameMode]: [Session, GameMode]) => {
        let actionsToDispatch: Action[] = [];

        if (gameMode === 'multiplayer') {
          actionsToDispatch = [
            new sessionActions.SubscribeToSession({ id: session.id }),
            new LoadSteps({ sessionId: session.id }),
          ];
        } else if (gameMode === 'single') {
          actionsToDispatch = [new sessionActions.SetSession(session)];
        }

        return actionsToDispatch;
      }),
      catchError((error) => of(new sessionActions.SessionFail(error))),
    )),
  );

  @Effect({ dispatch: false })
  updateSession$: Observable<Action> = this.actions$.pipe(
    ofType(sessionActions.ActionTypes.UpdateSession),
    map((action: sessionActions.UpdateSession) => action.payload),
    switchMap((updatedSessionData: Partial<Session>) => {
      return this.firestoreService.updateGameSession(updatedSessionData, updatedSessionData.id).pipe(
        catchError((error) => of(new sessionActions.SessionFail(error))),
      );
    }),
  );

  @Effect()
  sessionUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(sessionActions.ActionTypes.UnsubscribeFromSession),
    tap(() => {
      if (this.unsubscribeFromSession$) {
        this.unsubscribeFromSession$.next();
        this.unsubscribeFromSession$.complete();
      }
    }),
    map(() => new sessionActions.ClearSessionState()),
  );

  @Effect()
  sessionExit$: Observable<Action> = this.actions$.pipe(
    ofType(sessionActions.ActionTypes.SessionExit),
    mergeMap(() => [
      new sessionActions.UnsubscribeFromSession(),
      new UnsubscribeFromSteps(),
      new UnsubscribeFromPlayers(),
    ]),
  );

  @Effect({ dispatch: false })
  catchErrors$ = this.actions$.pipe(
    ofType(sessionActions.ActionTypes.SessionFail),
    map((action: sessionActions.SessionFail) => action.payload),
    tap((error: any) => {
      console.error('Error from SESSION effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
