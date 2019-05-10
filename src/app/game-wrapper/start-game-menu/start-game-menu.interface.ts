import { MultiGameSettings } from './create-new-multi-game/multi-game-setting.model';

export interface StartGameConfig {
  singleMode: SingleModeConfig;
  multiplayerMode: MultiplayerModeConfig;
  menuComponent?: any;
}

export interface SingleModeConfig {
  disabled?: boolean;
  continueDisabled?: boolean;
  continueLastDisabled?: boolean;
  watchSavedGamesDisabled?: boolean;
}

export interface MultiplayerModeConfig {
  disabled?: boolean;
  createNewDisabled?: boolean;
  joinGameByIdDisabled?: boolean;
  joinGameDisabled?: boolean;
  watchSavedGamesDisabled?: boolean;
  multiModeConfig?: Partial<MultiGameSettings>;
}
