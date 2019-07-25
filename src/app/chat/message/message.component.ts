import { Component, Input, OnInit } from '@angular/core';
import { Message } from './message.models';
import { User } from '../../auth/auth.interface';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  @Input() user: User;
  @Input() message: Message;

  constructor() { }

  ngOnInit() {}

}
