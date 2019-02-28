import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../services/firestore.service';
import {
  CREATE_SESSION,
  CreateSession, SESSION_FAIL, SessionFail,
  SetCreatedSession, SetUpdatedSession,
  UPDATE_SESSION, UpdateSession,
} from '../actions/session.actions';
import { NotifierService } from 'angular-notifier';


@Injectable()
export class SessionEffects {

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  createNewSession$: Observable<Action> = this.actions$.pipe(
    ofType(CREATE_SESSION),
    map((action: CreateSession) => action.payload),
    switchMap((payload) => this.firestoreService.createNewGameSession(payload.sessionData).pipe(
      map((docRef) => ({ ...payload.sessionData, id: docRef.id })),
      map((session) => new SetCreatedSession({ session: session })),
      catchError((error) => of(new SessionFail(error)))
    )),
  );

  @Effect()
  updateSession$: Observable<Action> = this.actions$.pipe(
    ofType(UPDATE_SESSION),
    map((action: UpdateSession) => action.payload.updatedSessionData),
    switchMap((updatedSessionData) => this.firestoreService.updateGameSession(updatedSessionData).pipe(
      map(() => new SetUpdatedSession({ updatedSessionData })),
      catchError((error) => of(new SessionFail(error)))
    ))
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
}
