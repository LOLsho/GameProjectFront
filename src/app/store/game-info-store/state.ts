import { GameMode } from '../../game-wrapper/game.interfaces';


export interface GameInfoState {
  id: string;
  name: string;
  gameMode: GameMode;
}

export const initialState: GameInfoState = {
  id: null,
  name: null,
  gameMode: null,
};
