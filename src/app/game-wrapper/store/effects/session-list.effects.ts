import { Injectable } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, Subject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Session } from '../../game.interfaces';
import {
  AddOneSessionToList,
  ClearSessionListState,
  RemoveOneSessionFromList,
  SessionListActionTypes,
  SessionListFail,
  SessionListLoaded,
  SubscribeToSessionList,
  UpdateOneSessionInList,
} from '../actions/session-list.actions';
import { AppState } from '../../../store/reducers';
import { UpdateGameItem } from '../../../store/actions/games-list.actions';
import { NotifierService } from 'angular-notifier';


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
    ofType(SessionListActionTypes.SubscribeToSessionList),
    tap(() => this.unsubscribeFromSessionList$ = new Subject()),
    map((action: SubscribeToSessionList) => action.payload),
    switchMap((query: any) => {
      return this.firestoreService.getSessionList(query).stateChanges().pipe(
        tap((actions) => {
          if (actions.length === 0) this.store.dispatch(new SessionListLoaded());
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
              return new AddOneSessionToList(session);
            case 'modified':
              return new UpdateOneSessionInList(session);
            case 'removed':
              return new RemoveOneSessionFromList(session);
          }
        }),
        catchError((error) => of(new SessionListFail(error))),
      );
    })
  );

  @Effect({ dispatch: false })
  sessionListUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(SessionListActionTypes.UnsubscribeFromSessionList),
    tap(() => {
      if (this.unsubscribeFromSessionList$) {
        this.unsubscribeFromSessionList$.next();
        this.unsubscribeFromSessionList$.complete();
      }
    }),
    map(() => new ClearSessionListState()),
  );

  @Effect({ dispatch: false })
  onSessionListError$ = this.actions$.pipe(
    ofType(SessionListActionTypes.SessionListFail),
    map((action: UpdateGameItem) => action.payload),
    tap((error: any) => {
      console.log('Error caught in SESSION LIST effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
