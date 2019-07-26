import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, Subject } from 'rxjs';
import {
  AddGeneralMessage,
  ChatActionTypes, ChatError, ClearGeneralMessagesState, GeneralMessagesLoaded,
  RemoveGeneralMessage, SendGeneralMessage, SubscribeToGeneralMessages,
  UpdateGeneralMessage,
} from '@store/chat-store/actions';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { FirestoreService, Query } from '../../services/firestore.service';
import { Message } from '../../chat/message/message.models';
import { NotifierService } from 'angular-notifier';
import { Action, Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { selectLastGeneralMessage } from '@store/chat-store/selectors';
import { environment } from '../../../environments/environment';
import * as sessionListActions from '@store/session-list-store/actions';


const serverLatency = environment.approximateServerLatency;


@Injectable()
export class ChatEffects {

  unsubFromGeneralMessages$: Subject<void>;

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  loadGeneralMessages: Observable<Action> = this.actions$.pipe(
    ofType(ChatActionTypes.LoadGeneralMessages),
    switchMap(() => this.firestoreService.getGeneralMessagesCollection().get().pipe(
      map((res: any): Message[] => {
        return res.docs.map((item) => {
          const messageData = item.data();
          messageData.timestamp = messageData.timestamp.toMillis();
          const stepId = item.id;
          return { ...messageData, id: stepId };
        });
      }),
      mergeMap((messages: Message[]) => [
        new GeneralMessagesLoaded(messages),
        new SubscribeToGeneralMessages(),
      ]),
    )),
  );

  @Effect()
  subscribeToGeneralMessages$: Observable<Action> = this.actions$.pipe(
    ofType(ChatActionTypes.SubscribeToGeneralMessages),
    tap(() => this.unsubFromGeneralMessages$ = new Subject()),
    withLatestFrom(this.store$.select(selectLastGeneralMessage)),
    map(([_, lastMessage]) => {
      let timestamp;
      if (lastMessage) {
        timestamp = this.firestoreService.getTimestampFromDate(lastMessage.timestamp);
      } else {
        timestamp = this.firestoreService.getTimestampFromDate(Date.now() - serverLatency);
      }
      const query: Query = { where: [{ field: 'timestamp', opStr: '>', value: timestamp }] };
      return query;
    }),
    switchMap((query: Query) => this.firestoreService.getGeneralMessagesCollection(query).stateChanges().pipe(
      takeUntil(this.unsubFromGeneralMessages$),
      mergeMap((actions) => actions),
      map((res: any) => {
        const messageData = res.payload.doc.data();
        messageData.timestamp = messageData.timestamp.toDate();
        const messageId = res.payload.doc.id;
        const message: Message = { ...messageData, id: messageId };
        return { message, action: res.type };
      }),
      map(({ message, action }) => {
        switch (action) {
          case 'added':
            return new AddGeneralMessage(message);
          case 'modified':
            return new UpdateGeneralMessage(message);
          case 'removed':
            return new RemoveGeneralMessage(message);
        }
      }),
      catchError((error) => of(new ChatError(error))),
    )),
  );

  @Effect()
  generalMessagesUnsubscribe$: Observable<Action> = this.actions$.pipe(
    ofType(ChatActionTypes.UnsubscribeFromGeneralMessages),
    tap(() => {
      if (this.unsubFromGeneralMessages$) {
        this.unsubFromGeneralMessages$.next();
        this.unsubFromGeneralMessages$.complete();
      }
    }),
    map(() => new ClearGeneralMessagesState()),
  );

  @Effect({ dispatch: false })
  sendGeneralMessage$ = this.actions$.pipe(
    ofType(ChatActionTypes.SendGeneralMessage),
    map((action: SendGeneralMessage) => action.payload),
    switchMap((message: Message) => this.firestoreService.sendGeneralMessage(message).pipe(
      // tap((response) => console.log(response)),
    )),
  );

  @Effect({ dispatch: false })
  onChatError$ = this.actions$.pipe(
    ofType(ChatActionTypes.ChatError),
    map((action: ChatError) => action.payload),
    tap((error: any) => {
      console.error('Error in CHAT effects:', error);
      if (error.massage) this.notifierService.notify('error', error.massage);
    }),
  );
}
