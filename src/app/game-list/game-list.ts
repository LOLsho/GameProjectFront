import { SapperComponent } from '../games/sapper/sapper.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { Games } from '../game-wrapper/game.interfaces';

export const GAMES: Games = [
  { title: 'tic-tac-toe', component: TicTacToeComponent },
  // {gameTitle: 'spaceship'},
  { title: 'sapper', component: SapperComponent },
];


