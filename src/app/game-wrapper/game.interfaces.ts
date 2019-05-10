import { StartGameConfig } from './start-game-menu/start-game-menu.interface';
import { GameData, GameStep } from '../games/games.models';
import { User } from '../auth/auth.interface';
import { GameMoveOrder } from './start-game-menu/create-new-multi-game/multi-game-setting.model';

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
export type MultiModeAction = 'createNewGame' | 'joinGameById' | 'joinGame' | 'watchSavedGames';


export interface Session extends CreatedSession {
  id: string;
}

export interface CreatedSession {
  isSessionOver: boolean;
  created: any;
  creatorId: string;
  gameData: GameData;
  gameMode: GameMode;
  private?: boolean;
  maxParticipants?: number;
  moveOrder?: GameMoveOrder;
  playerIds?: string[];
}

export interface Step extends GameStep {
  id: string;
  userId: string;
  timestamp: any;
}

export interface GameDataForLaunching {
  gameMode: GameMode;
  action: SingleModeAction | MultiModeAction;
  gameComponent: any;
  user: User;
}
