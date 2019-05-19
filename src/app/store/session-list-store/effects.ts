import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirestoreService, Query } from '../../services/firestore.service';
import { NotifierService } from 'angular-notifier';
import { catchError, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Session } from '../../game-wrapper/game.interfaces';
import * as sessionListActions from './actions';
import { AppState } from '@store/state';


@Injectable()
export class SessionListEffects {

  unsubscribeFromSessionList$: Subject<void>;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  subscribeToSessionList$: Observable<Action> = this.actions$.pipe(
    ofType(sessionListActions.ActionTypes.SubscribeToSessionList),
    tap(() => this.unsubscribeFromSessionList$ = new Subject()),
    map((action: sessionListActions.SubscribeToSessionList) => action.payload),
    switchMap((query: Query) => {
      return this.firestoreService.getSessionList(query).stateChanges().pipe(
        tap((actions) => {
          if (actions.length === 0) this.store.dispatch(new sessionListActions.SessionListLoaded());
        }),
        takeUntil(this.unsubscribeFromSessionList$),
        mergeMap((actions) => actions),
        map((res: any) => {
          const sessionData = res.payload.doc.data();
          sessionData.created = sessionData.created.toDate();
          const sessionId = res.payload.doc.id;
          const session: Session = { ...sessionData, id: sessionId };
          return { session, action: res.type };
        }),
        map(({ session, action }) => {
          switch (action) {
            case 'added':
              return new sessionListActions.AddOneSessionToList(session);
            case 'modified':
              return new sessionListActions.UpdateOneSessionInList(session);
            case 'removed':
              return new sessionListActions.RemoveOneSessionFromList(session);
          }
        }),
        catchError((error) => of(new sessionListActions.SessionListFail(error))),
      );
    })
  );

  @Effect()
  sessionListUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(sessionListActions.ActionTypes.UnsubscribeFromSessionList),
    tap(() => {
      if (this.unsubscribeFromSessionList$) {
        this.unsubscribeFromSessionList$.next();
        this.unsubscribeFromSessionList$.complete();
      }
    }),
    map(() => new sessionListActions.ClearSessionListState()),
  );

  @Effect({ dispatch: false })
  onSessionListError$ = this.actions$.pipe(
    ofType(sessionListActions.ActionTypes.SessionListFail),
    map((action: sessionListActions.SessionListFail) => action.payload),
    tap((error: any) => {
      console.error('Error in SESSION LIST effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
