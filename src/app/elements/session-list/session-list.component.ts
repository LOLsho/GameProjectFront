import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '../../game-wrapper/game.interfaces';
import { Language } from 'angular-l10n';
import { emersionAnimation } from '../../animations/emersion.animation';
import { User } from '../../auth/auth.interface';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
  animations: [emersionAnimation],
})
export class SessionListComponent implements OnInit {

  @Language() lang: string;

  @Input() sessions: Session[];
  @Input() user: User;

  @Output() sessionChosen = new EventEmitter<Session>();

  constructor() { }

  ngOnInit() {}

  joinSession(session: Session) {
    this.sessionChosen.emit(session);
  }
}
