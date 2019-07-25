import { Component, OnDestroy, OnInit } from '@angular/core';
import { Language } from 'angular-l10n';
import { Message } from './message/message.models';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { LoadGeneralMessages, SendGeneralMessage } from '@store/chat-store/actions';
import { selectAllGeneralMessages, selectGeneralMessagesLoaded } from '@store/chat-store/selectors';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { User } from '../auth/auth.interface';
import { selectAuthUser } from '@store/auth-store/selectors';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {

  @Language() lang: string;

  user: User;
  messages: Message[];

  messageAdded$: Subject<void> = new Subject<void>();

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
  ) {}

  ngOnInit() {
    this.subscribe();
  }

  subscribe() {
    this.subscriptions.push(this.store.select(selectAuthUser).subscribe((user: User) => {
      this.user = user;
    }));

    this.subscriptions.push(this.store.select(selectGeneralMessagesLoaded).pipe(
      filter((loaded: boolean) => {
        if (loaded) return true;
        else this.store.dispatch(new LoadGeneralMessages());
      }),
      switchMap(() => this.store.select(selectAllGeneralMessages)),
    ).subscribe((messages: Message[]) => {
      this.messages = messages;
    }));




    // this.subscriptions.push(this.sendMessage$.pipe(withLatestFrom(this.user$)).subscribe(
    //   ([messageText, user]: [string, User]) => {
    //     const message: Message = {
    //       text: messageText,
    //       userId: user.uid,
    //       name: user.name,
    //       timestamp: this.firestoreService.getFirestoreTimestamp(),
    //     };
    //     this.messageAdded$.next(message);
    //     this.store.dispatch(new SendGeneralMessage(message));
    //   }
    // ));
  }

  hideChat() {
    console.log('in hide chat');
  }

  sendMessage(messageText: string) {
    if (!this.messages) return;
    const message: Message = {
      text: messageText,
      userId: this.user.uid,
      name: this.user.name,
      timestamp: this.firestoreService.getFirestoreTimestamp().toDate(),
    };
    this.messages.push(message);
    this.messageAdded$.next();
    setTimeout(() => {
      this.store.dispatch(new SendGeneralMessage(message));
    }, 500);

    // this.messages.push({ text: message, userId: '123321', timestamp: '15:48' });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
