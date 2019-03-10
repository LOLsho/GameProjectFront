import { Injectable } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, pipe, Subject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  debounce,
  debounceTime,
  first,
  map,
  mergeMap,
  sample,
  sampleTime,
  switchMap, takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Session } from '../../game.interfaces';
import {
  AddOneSessionToList, ClearSessionListState, RemoveOneSessionFromList, SessionListLoaded,
  SUBSCRIBE_TO_SESSION_LIST,
  SubscribeToSessionList, UNSUBSCRIBE_FROM_SESSION_LIST, UpdateOneSessionInList,
} from '../actions/session-list.actions';
import { AppState } from '../../../store/reducers';
import { selectAllSessions, selectSessionListIds } from '../selectors/session-list.selectors';


@Injectable()
export class SessionListEffects {

  unsubscribeFromSessionList$: Subject<void>;

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
  ) {}

  @Effect()
  subscribeToSessionList$: Observable<Action> = this.actions$.pipe(
    ofType(SUBSCRIBE_TO_SESSION_LIST),
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
        }), // TODO Catch Errors
      );
    })
  );

  @Effect()
  sessionListUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(UNSUBSCRIBE_FROM_SESSION_LIST),
    tap(() => {
      if (this.unsubscribeFromSessionList$) {
        this.unsubscribeFromSessionList$.next();
        this.unsubscribeFromSessionList$.complete();
      }
    }),
    map(() => new ClearSessionListState()),
  );
}
