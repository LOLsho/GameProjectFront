import { GameInitial } from '../game-wrapper/game.interfaces';
import { chessInitial } from '../games/chess/chess.initial';
import { sapperInitial } from '../games/sapper/sapper.initial';
import { ticTacToeInitial } from '../games/tic-tac-toe/tic-tac-toe.initial';
import { snakeInitial } from '../games/snake/snake.initial';

export const GAMES: GameInitial[] = [
  ticTacToeInitial,
  sapperInitial,
  chessInitial,
  snakeInitial,
];


