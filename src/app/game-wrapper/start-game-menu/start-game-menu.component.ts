import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StartGameConfig } from './start-game-menu.interface';
import { MenuOption } from '../../elements/menu/menu.component';
import { GameMode, SingleModeAction } from '../game.interfaces';

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
    { value: 'continue', capture: 'SINGLE-MODE-ACTIONS__CONTINUE' },
    { value: 'watchSavedGames', capture: 'SINGLE-MODE-ACTIONS__WATCH', disabled: true },
  ];

  @Input() startGameConfig: StartGameConfig;

  @Output() gameSettingsChosen = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.choseModeOptions[0].disabled = this.startGameConfig.singleMode.disabled;
    this.choseModeOptions[1].disabled = this.startGameConfig.multiplayerMode.disabled;

    this.choseSingleModeActions[1].disabled = this.startGameConfig.singleMode.continueDisabled;
    this.choseSingleModeActions[2].disabled = this.startGameConfig.singleMode.watchSavedGamesDisabled;
  }

  startingSelected(singleModeAction: SingleModeAction) {
    this.singleModeAction = singleModeAction;
    this.gameSettingsChosen.emit({
      gameMode: this.gameMode,
      singleModeAction: this.singleModeAction,
    });
  }
}
