import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '../../game-wrapper/game.interfaces';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent implements OnInit {

  @Language() lang: string;

  @Input() sessions: Session[];
  @Output() sessionChosen = new EventEmitter<Session>();

  constructor() { }

  ngOnInit() {
  }

  sessionClicked(session: Session) {
    this.sessionChosen.emit(session);
  }
}
