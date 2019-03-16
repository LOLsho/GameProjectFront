import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, Subject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService } from '../../../services/firestore.service';
import {
  ClearSessionState,
  CREATE_SESSION,
  CreateSession, SESSION_EXIT,
  SESSION_FAIL,
  SessionFail,
  SetSession,
  SUBSCRIBE_TO_SESSION,
  SubscribeToSession, UNSUBSCRIBE_FROM_SESSION, UnsubscribeFromSession,
  UPDATE_SESSION,
  UpdateSession,
} from '../actions/session.actions';
import { NotifierService } from 'angular-notifier';
import { CreatedSession, GameMode, Session } from '../../game.interfaces';
import { LoadSteps, UnsubscribeFromSteps } from '../actions/steps.actions';
import { AppState } from '../../../store/reducers';
import { selectGameMode } from '../selectors/game-info.selectors';


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
  subscribeToSession: Observable<Action> = this.actions$.pipe(
    ofType(SUBSCRIBE_TO_SESSION),
    tap(() => this.unsubscribeFromSession$ = new Subject()),
    map((action: SubscribeToSession) => action.payload.id),
    switchMap((sessionId: string) => {
      return this.firestoreService.getSessionDocument(sessionId).valueChanges().pipe(
        takeUntil(this.unsubscribeFromSession$),
        map((session) => ({ ...session, id: sessionId})),
        map((session: Session) => new SetSession(session)),
      );
    }),
  );

  @Effect()
  createNewSession$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_SESSION),
    map((action: CreateSession) => action.payload),
    switchMap((createdSession: CreatedSession) => this.firestoreService.createNewGameSession(createdSession).pipe(
      map((docRef) => ({ ...createdSession, id: docRef.id })),
      withLatestFrom(this.store.select(selectGameMode)),
      mergeMap(([session, gameMode]: [Session, GameMode]) => {
        let actionsToDispatch: Action[] = [];

        if (gameMode === 'multiplayer') {
          actionsToDispatch = [
            new SubscribeToSession({ id: session.id }),
            new LoadSteps({ sessionId: session.id }),
          ];
        } else if (gameMode === 'single') {
          actionsToDispatch = [new SetSession(session)];
        }

        return actionsToDispatch;
      }),
      catchError((error) => of(new SessionFail(error))),
    )),
  );

  @Effect({ dispatch: false })
  updateSession$: Observable<Action> = this.actions$.pipe(
    ofType(UPDATE_SESSION),
    map((action: UpdateSession) => action.payload),
    switchMap((updatedSessionData: Partial<Session>) => {
      return this.firestoreService.updateGameSession(updatedSessionData).pipe(
        catchError((error) => of(new SessionFail(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  catchErrors$ = this.actions$.pipe(
    ofType(SESSION_FAIL),
    map((action: SessionFail) => action.payload),
    tap((error: any) => {
      console.log('Error from FIREBASE API (SESSION-ERROR):', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );

  @Effect()
  sessionUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(UNSUBSCRIBE_FROM_SESSION),
    tap(() => {
      if (this.unsubscribeFromSession$) {
        this.unsubscribeFromSession$.next();
        this.unsubscribeFromSession$.complete();
      }
    }),
    map(() => new ClearSessionState()),
  );

  @Effect()
  sessionExit$: Observable<Action> = this.actions$.pipe(
    ofType(SESSION_EXIT),
    mergeMap(() => [
      new UnsubscribeFromSession(),
      new UnsubscribeFromSteps(),
    ]),
  );
}