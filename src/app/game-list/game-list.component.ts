import { Component, OnInit } from '@angular/core';
import { Games, GAMES } from './game-list';
import { Language } from 'angular-l10n';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {

  @Language() lang: string;

  games: Games = GAMES;

  constructor() {

  }

  ngOnInit() {

  }

}
