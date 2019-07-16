import { GameInitial } from '../../game-wrapper/game.interfaces';
import { SnakeComponent } from './snake.component';

export const snakeInitial: GameInitial = {
  name: 'snake',
  imageSrc: '../../assets/games/snake/images/card-bg.jpg',
  component: SnakeComponent,
  // menuComponent: SapperStartMenuComponent,
  startGameConfig: {
    singleMode: {
      disabled: false,
      continueLastDisabled: true,
      continueDisabled: false,
      watchSavedGamesDisabled: true,
    },
    multiplayerMode: {
      disabled: true,
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
};
