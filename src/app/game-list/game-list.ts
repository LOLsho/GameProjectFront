import { SapperComponent } from '../games/sapper/sapper.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { GameInitial } from '../game-wrapper/game.interfaces';
import { SapperStartMenuComponent } from '../games/sapper/sapper-start-menu/sapper-start-menu.component';
import { ChessComponent } from '../games/chess/chess.component';

export const GAMES: GameInitial[] = [
  {
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
  },
  {
    name: 'sapper',
    imageSrc: '../../assets/games/sapper/images/card-bg.jpg',
    component: SapperComponent,
    menuComponent: SapperStartMenuComponent,
    startGameConfig: {
      singleMode: {
        disabled: false,
        continueLastDisabled: true,
        continueDisabled: false,
        watchSavedGamesDisabled: true,
      },
      multiplayerMode: {
        disabled: false,
        createNewDisabled: false,
        joinGameByIdDisabled: false,
        joinGameDisabled: false,
        watchSavedGamesDisabled: true,
        multiModeConfig: {
          // moveOrder: 'no-order',
          maxParticipants: null,
        },
      },
    },
  },
  {
    name: 'chess',
    imageSrc: '../../assets/games/chess/images/chess-card-bg.jpg',
    component: ChessComponent,
    // menuComponent: SapperStartMenuComponent,
    startGameConfig: {
      singleMode: {
        disabled: true,
        continueLastDisabled: true,
        continueDisabled: false,
        watchSavedGamesDisabled: true,
      },
      multiplayerMode: {
        disabled: false,
        createNewDisabled: false,
        joinGameByIdDisabled: false,
        joinGameDisabled: false,
        watchSavedGamesDisabled: true,
        multiModeConfig: {
          maxParticipants: 2,
          moveOrder: 'player-by-player',
        },
      },
    },
  },
];


