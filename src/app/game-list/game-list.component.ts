import {Component, OnInit} from '@angular/core';
import {GAMES} from './game-list';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  GAMES = GAMES;

  constructor() {
  }

  ngOnInit() {
  }

}
