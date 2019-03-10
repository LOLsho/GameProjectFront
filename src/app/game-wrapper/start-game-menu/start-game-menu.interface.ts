export interface StartGameConfig {
  singleMode: SingleModeConfig;
  multiplayerMode: MultiplayerModeConfig;
}

export interface SingleModeConfig {
  disabled?: boolean;
  continueDisabled?: boolean;
  continueLastDisabled?: boolean;
  watchSavedGamesDisabled?: boolean;
}

export interface MultiplayerModeConfig {
  disabled?: boolean;
}
