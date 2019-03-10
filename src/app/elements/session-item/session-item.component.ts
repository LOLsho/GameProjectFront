import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '../../game-wrapper/game.interfaces';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss']
})
export class SessionItemComponent implements OnInit {

  @Input() session: Session;
  @Output() sessionClicked = new EventEmitter<Session>();

  constructor() {
  }

  ngOnInit() {}

  onSessionClick() {
    this.sessionClicked.emit(this.session);
  }
}
