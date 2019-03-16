import { SapperGameData, SapperStep } from './sapper/sapper.interfaces';
import { SapperComponent } from './sapper/sapper.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';

export type GameData = SapperGameData;

export type GameStep = SapperStep;

export type GameComponents = SapperComponent | TicTacToeComponent;
