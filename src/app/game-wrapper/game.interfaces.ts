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
  menuComponent?: any;
  startGameConfig: StartGameConfig;
}


export type GameMode = 'single' | 'multiplayer';
export type SingleModeAction = 'newGame' | 'continue' | 'continueLast' | 'watchSavedGames';

export interface GameSettings {
  gameMode: GameMode;
  singleModeAction: SingleModeAction;
}

export interface Session extends CreatedSession {
  id: string;
}

export interface CreatedSession {
  isSessionOver: boolean;
  created: any;
  creatorId: string;
  gameData: any;
  gameMode: GameMode;
}

export interface Step extends NewStep {
  id: string;
}

export interface NewStep {
  clickType: 'left' | 'right';
  cellId: number;
  userId: string;
  timestamp: any;
}
