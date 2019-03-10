import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StartGameConfig } from './start-game-menu.interface';
import { MenuOption } from '../../elements/menu/menu.component';
import { GameMode, SingleModeAction } from '../game.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';

@Component({
  selector: 'app-start-game-menu',
  templateUrl: './start-game-menu.component.html',
  styleUrls: ['./start-game-menu.component.scss']
})
export class StartGameMenuComponent implements OnInit {

  gameMode: GameMode;
  singleModeAction: SingleModeAction;

  choseModeOptions: MenuOption[] = [
    { value: 'single', capture: 'CHOOSE-MODE__SINGLE' },
    { value: 'multiplayer', capture: 'CHOOSE-MODE__MULTIPLAYER', disabled: true },
  ];
  choseSingleModeActions: MenuOption[] = [
    { value: 'newGame', capture: 'SINGLE-MODE-ACTIONS__NEW' },
    { value: 'continueLast', capture: 'SINGLE-MODE-ACTIONS__CONTINUE-LAST' },
    { value: 'continue', capture: 'SINGLE-MODE-ACTIONS__CONTINUE' },
    { value: 'watchSavedGames', capture: 'SINGLE-MODE-ACTIONS__WATCH', disabled: true },
  ];

  @Input() startGameConfig: StartGameConfig;

  @Output() gameSettingsChosen = new EventEmitter();

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.choseModeOptions[0].disabled = this.startGameConfig.singleMode.disabled;
    this.choseModeOptions[1].disabled = this.startGameConfig.multiplayerMode.disabled;

    this.choseSingleModeActions[1].disabled = this.startGameConfig.singleMode.continueLastDisabled;
    this.choseSingleModeActions[2].disabled = this.startGameConfig.singleMode.continueDisabled;
    this.choseSingleModeActions[3].disabled = this.startGameConfig.singleMode.watchSavedGamesDisabled;
  }

  onGameModeSelected(option: MenuOption) {
    this.gameMode = option.value;
  }

  startingSelected(singleModeAction: SingleModeAction) {
    this.singleModeAction = singleModeAction;
    this.gameSettingsChosen.emit({
      gameMode: this.gameMode,
      singleModeAction: this.singleModeAction,
    });
  }
}
