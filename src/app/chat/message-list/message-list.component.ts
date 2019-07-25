import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Message } from '../message/message.models';
import { Subject, Subscription } from 'rxjs';
import { emersionAnimation } from '../../animations/emersion.animation';
import { User } from '../../auth/auth.interface';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  animations: [emersionAnimation],
})
export class MessageListComponent implements OnInit, OnDestroy {

  @ViewChild('messagesWrap') messagesWrap: ElementRef;

  @Input() messageAdded$: Subject<void>;
  @Input() user: User;
  @Input()
  set messages(messages: Message[]) {
    this._messages = messages;
    setTimeout(() => this.goToBottom());
  }

  get messages(): Message[] {
    return this._messages;
  }

  _messages: Message[];

  sub: Subscription;

  constructor() { }

  ngOnInit() {
    this.sub = this.messageAdded$.subscribe(() => {
      setTimeout(() => this.goToBottom());
    });
  }

  goToBottom() {
    if (!this.messagesWrap) return;
    this.messagesWrap.nativeElement.scrollIntoView(false);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
