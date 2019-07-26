import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('chatContainer') chatContainer: ElementRef;

  chatHidden = false;

  user: User;
  messages: Message[];

  messageAdded$: Subject<void> = new Subject<void>();

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadGeneralMessages());
    console.warn('here');
    this.subscribe();
  }

  subscribe() {
    this.subscriptions.push(this.store.select(selectAuthUser).subscribe((user: User) => {
      this.user = user;
    }));

    this.subscriptions.push(this.store.select(selectAllGeneralMessages).subscribe((messages: Message[]) => {
      this.messages = messages;
    }));
  }

  hideChat() {
    const transformStyle = this.chatContainer.nativeElement.style.transform;
    let cutStyle;
    let transformXNum;

    if (transformStyle) {
      cutStyle = transformStyle.substr(12);
      transformXNum = parseInt(cutStyle, 10);
    } else {
      transformXNum = 0;
    }
    this.chatHidden = true;
    this.chatContainer.nativeElement.style.left = `${window.innerWidth - transformXNum}px`;
  }

  returnChat() {
    this.chatHidden = false;
    this.chatContainer.nativeElement.style.left = `${window.innerWidth - 340}px`;
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
