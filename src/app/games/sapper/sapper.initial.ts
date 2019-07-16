import { GameInitial } from '../../game-wrapper/game.interfaces';
import { SapperComponent } from './sapper.component';
import { SapperStartMenuComponent } from './sapper-start-menu/sapper-start-menu.component';

export const sapperInitial: GameInitial = {
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
};
