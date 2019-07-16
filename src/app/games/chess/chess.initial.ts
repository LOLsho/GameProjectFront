import { GameInitial } from '../../game-wrapper/game.interfaces';
import { ChessComponent } from './chess.component';

export const chessInitial: GameInitial = {
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
};
