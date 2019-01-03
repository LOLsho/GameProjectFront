import { Component, OnInit } from '@angular/core';
import { GAMES } from './game-list';
import { AuthService } from '../services/auth.service';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {

  @Language() lang: string;

  GAMES = GAMES;

  constructor(
    private auth: AuthService,
  ) {
  }

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      console.log({isLoggedIn});
    });
  }

}
