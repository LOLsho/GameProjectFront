import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  AddPlayer, ClearPlayersState, KickOutPlayer,
  PlayersActionType,
  PlayersError, PlayersLoaded, RemovePlayer,
  SubscribeToPlayers,
  UpdatePlayer,
} from '@store/players-store/actions';
import { catchError, concatMap, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService, Query } from '../../services/firestore.service';
import { NotifierService } from 'angular-notifier';
import { User } from '../../auth/auth.interface';
import { AppState } from '@store/state';
import { selectSessionState } from '@store/session-store/selectors';
import { Session } from '../../game-wrapper/game.interfaces';
import { selectPlayersLoaded } from '@store/players-store/selectors';
import { selectAuthUserId } from '@store/auth-store/selectors';
import { RouterGo } from '@store/router-store/actions';
import { MatDialog } from '@angular/material';
import { BoxComponent } from '../../elements/box/box.component';
import { ModalInfoComponent } from '../../elements/modal-info/modal-info.component';
import { TranslationService } from 'angular-l10n';


@Injectable()
export class PlayersEffects {

  unsubscribeFromPlayers$: Subject<void>;

  constructor(
    private actions$: Actions,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
    private store: Store<AppState>,
    private modal: MatDialog,
    private translation: TranslationService,
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
        withLatestFrom(this.store.select(selectPlayersLoaded)),
        mergeMap(([{ player, action }, playersLoaded]) => {
          const actionsToDispatch: Action[] = [];
          switch (action) {
            case 'added':
              actionsToDispatch.push(new AddPlayer(player)); break;
            case 'modified':
              actionsToDispatch.push(new UpdatePlayer(player)); break;
            case 'removed':
              actionsToDispatch.push(new RemovePlayer(player)); break;
          }

          if (!playersLoaded) {
            actionsToDispatch.push(new PlayersLoaded());
          }

          return actionsToDispatch;
        }),
        catchError((error) => of(new PlayersError(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  kickOutPlayer$ = this.actions$.pipe(
    ofType(PlayersActionType.KickOutPlayer),
    map((action: KickOutPlayer) => action.payload.uid),
    withLatestFrom(this.store.select(selectSessionState)),
    switchMap(([playerId, session]: [string, Session]) => {
      const playerIndex = session.playerIds.findIndex((id: string) => id === playerId);
      session.playerIds.splice(playerIndex, 1);
      return this.firestoreService.updateGameSession(session, session.id).pipe(
        catchError((error) => of(new PlayersError(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  playerKickedOut = this.actions$.pipe(
    ofType(PlayersActionType.RemovePlayer),
    map((action: RemovePlayer) => action.payload.uid),
    withLatestFrom(this.store.select(selectAuthUserId)),
    tap(([deletedPlayerId, myId]) => {
      if (deletedPlayerId === myId) {
        const modalRef = this.modal.open(ModalInfoComponent);
        modalRef.componentInstance.text = this.translation.translate('You have been kicked out from the game') + ' =(';
        this.store.dispatch(new RouterGo({ path: ['/games'] }));
      }
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
