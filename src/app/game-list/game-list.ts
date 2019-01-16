import { SapperComponent } from '../games/sapper/sapper.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';

export const GAMES: Games = [
  { title: 'tic-tac-toe', component: TicTacToeComponent },
  // {gameTitle: 'spaceship'},
  { title: 'sapper', component: SapperComponent },
];


export interface Game {
  title: string;
  component: any;
}

export type Games = Game[];
