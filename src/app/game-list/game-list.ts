import { SapperComponent } from '../games/sapper/sapper.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { Games } from '../game-wrapper/game.interfaces';

export const GAMES: Games = [
  {
    name: 'tic-tac-toe',
    imageSrc: '../../assets/games/tic-tac-toe/images/card-bg.jpg',
    component: TicTacToeComponent
  },
  // {gameTitle: 'spaceship'},
  {
    name: 'sapper',
    imageSrc: '../../assets/games/sapper/images/card-bg.jpg',
    component: SapperComponent
  },
];


