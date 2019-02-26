import { SapperComponent } from '../games/sapper/sapper.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { GameInitial } from '../game-wrapper/game.interfaces';

export const GAMES: GameInitial[] = [
  {
    name: 'tic-tac-toe',
    imageSrc: '../../assets/games/tic-tac-toe/images/card-bg.jpg',
    component: TicTacToeComponent,
    startGameConfig: {
      singleMode: {
        continueDisabled: true,
        watchSavedGamesDisabled: true,
      },
      multiplayerMode: {
        disabled: true,
      },
    },
  },
  // {gameTitle: 'spaceship'},
  {
    name: 'sapper',
    imageSrc: '../../assets/games/sapper/images/card-bg.jpg',
    component: SapperComponent,
    startGameConfig: {
      singleMode: {
        continueDisabled: true,
        watchSavedGamesDisabled: true,
      },
      multiplayerMode: {
        disabled: true,
      },
    },
  },
];


