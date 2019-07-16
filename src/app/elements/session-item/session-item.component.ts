import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from '../../game-wrapper/game.interfaces';
import { Language } from 'angular-l10n';
import { User } from '../../auth/auth.interface';


@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss'],
})
export class SessionItemComponent implements OnInit {

  @Language() lang: string;

  @Input() session: Session;
  @Input() user: User;

  @Output() joinClicked = new EventEmitter<Session>();
  @Output() updateSession = new EventEmitter<Partial<Session>>();

  constructor() {}

  ngOnInit() {}

  joinGame() {
    this.joinClicked.emit(this.session);
  }

  get conditionToDisableJoin(): boolean {
    if (this.session.gameMode === 'multiplayer') {
      return !this.session.playerIds.includes(this.user.uid) && this.session.playerIds.length >= this.session.maxParticipants;
    } else {
      return false;
    }
  }
}


