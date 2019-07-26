import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Language, TranslationService } from 'angular-l10n';
import { Message } from './message/message.models';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store/state';
import { LoadGeneralMessages, SendGeneralMessage } from '@store/chat-store/actions';
import {
  selectAllGeneralMessages,
  selectLastGeneralMessage,
} from '@store/chat-store/selectors';
import { User } from '../auth/auth.interface';
import { selectAuthUser } from '@store/auth-store/selectors';
import { FirestoreService } from '../services/firestore.service';
import { NotifierService } from 'angular-notifier';

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
  amountUnreadMessages = 0;

  messageAdded$: Subject<void> = new Subject<void>();

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private firestoreService: FirestoreService,
    private notifierService: NotifierService,
    private translation: TranslationService,
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadGeneralMessages());
    this.subscribe();
  }

  subscribe() {
    this.subscriptions.push(this.store.select(selectAuthUser).subscribe((user: User) => {
      this.user = user;
    }));

    this.subscriptions.push(this.store.select(selectAllGeneralMessages).subscribe((messages: Message[]) => {
      this.messages = messages;
    }));

    this.subscriptions.push(this.store.select(selectLastGeneralMessage).subscribe((message: Message) => {
      if (!message || !this.user) return;
      if (this.user.uid === message.userId) return;

      if (this.chatHidden) {
        this.amountUnreadMessages++;
        const note = `${message.name || 'Anonymous'}: ${message.text}`;
        this.notifierService.notify('default', note);
      }
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
    setTimeout(() => this.amountUnreadMessages = 0, 800);
    this.chatContainer.nativeElement.style.left = `${window.innerWidth - 500}px`;
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
  }

  get returnChatTooltip(): string {
    const inscription1 = this.translation.translate('Show chat');
    const inscription2 = this.translation.translate('Unread messages');
    return `${inscription1} | ${inscription2}: ${this.amountUnreadMessages}`;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
