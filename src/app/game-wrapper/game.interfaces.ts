import { StartGameConfig } from './start-game-menu/start-game-menu.interface';

export interface GameItem {
  name: string;
  imageSrc: string;
  id: string;
  blocked: boolean;

  lastTimeVisited?: string;
}

export type GameList = GameItem[];

export interface GameInitial {
  name: string;
  imageSrc: string;
  component: any;
  startGameConfig: StartGameConfig;
}


export type GameMode = 'single' | 'multiplayer';
export type SingleModeAction = 'newGame' | 'continue' | 'watchSavedGames';

export interface GameSettings {
  gameMode: GameMode;
  SingleModeAction: SingleModeAction;
}
