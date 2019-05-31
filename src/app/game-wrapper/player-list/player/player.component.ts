import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../auth/auth.interface';
import { SelectMenuItem } from '../../../elements/select-menu/select-menu.config';
import { TranslationService } from 'angular-l10n';
import { PlayerAction } from './player.config';
import { Session } from '../../game.interfaces';



@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {

  @Input() session: Session;
  @Input() player: User;
  @Input() me: User;

  @Output() kickOut = new EventEmitter();

  menu: SelectMenuItem<PlayerAction>[] = [];

  constructor(
    private translation: TranslationService,
  ) { }

  ngOnInit() {
    if (this.me.uid !== this.player.uid && this.me.uid === this.session.creator.uid) {
      this.menu.push({ innerHtml: this.translation.translate('Kick out'), value: 'kickOut' });
    }
  }

  onPlayerActionClick(action: SelectMenuItem<PlayerAction>) {
    switch (action.value) {
      case 'kickOut': this.kickOut.emit(); break;
      case 'addToFriends':
      default: break;
    }
  }
}
