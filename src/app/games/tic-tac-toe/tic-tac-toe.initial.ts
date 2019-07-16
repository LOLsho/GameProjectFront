import { GameInitial } from '../../game-wrapper/game.interfaces';
import { TicTacToeComponent } from './tic-tac-toe.component';

export const ticTacToeInitial: GameInitial = {
  name: 'tic-tac-toe',
  imageSrc: '../../assets/games/tic-tac-toe/images/card-bg.jpg',
  component: TicTacToeComponent,
  // menuComponent: '',
  startGameConfig: {
    singleMode: {
      disabled: false,
      continueLastDisabled: true,
      continueDisabled: true,
      watchSavedGamesDisabled: true,
    },
    multiplayerMode: {
      disabled: true,
    },
  },
};
