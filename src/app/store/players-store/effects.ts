import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  AddPlayer, ClearPlayersState,
  PlayersActionType,
  PlayersError, RemovePlayer,
  SubscribeToPlayers,
  UpdatePlayer,
} from '@store/players-store/actions';
import { catchError, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FirestoreService, Query } from '../../services/firestore.service';
import { NotifierService } from 'angular-notifier';
import { User } from '../../auth/auth.interface';


@Injectable()
export class PlayersEffects {

  unsubscribeFromPlayers$: Subject<void>;

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  subscribeToPlayers$: Observable<Action> = this.actions$.pipe(
    ofType(PlayersActionType.SubscribeToPlayers),
    tap(() => this.unsubscribeFromPlayers$ = new Subject()),
    map((action: SubscribeToPlayers) => action.payload.sessionId),
    switchMap((sessionId: string) => {
      const query: Query = {
        where: [{ field: 'activeSessions', opStr: 'array-contains', value: sessionId },],
      };
      return this.firestoreService.getUsers(query).stateChanges().pipe(
        takeUntil(this.unsubscribeFromPlayers$),
        mergeMap((actions) => actions),
        map((res: any) => {
          const player: User = res.payload.doc.data();
          return { player: player, action: res.type };
        }),
        map(({ player, action }) => {
          switch (action) {
            case 'added':
              return new AddPlayer(player);
            case 'modified':
              return new UpdatePlayer(player);
            case 'removed':
              return new RemovePlayer(player);
          }
        }),
        catchError((error) => of(new PlayersError(error)))
      );
    }),
  );

  @Effect()
  playersUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(PlayersActionType.UnsubscribeFromPlayers),
    tap(() => {
      if (this.unsubscribeFromPlayers$) {
        this.unsubscribeFromPlayers$.next();
        this.unsubscribeFromPlayers$.complete();
      }
    }),
    map(() => new ClearPlayersState()),
  );

  @Effect({ dispatch: false })
  onPlayersError = this.actions$.pipe(
    ofType(PlayersActionType.PlayersError),
    map((action: PlayersError) => action.payload),
    tap((error: any) => {
      console.error('Error in PLAYERS effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
