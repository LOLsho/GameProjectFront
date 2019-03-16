import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Language } from 'angular-l10n';
import { MultiGameSettings } from './multi-game-setting.model';

@Component({
  selector: 'app-create-new-multi-game',
  templateUrl: './create-new-multi-game.component.html',
  styleUrls: ['./create-new-multi-game.component.scss']
})
export class CreateNewMultiGameComponent implements OnInit {

  @Language() lang: string;

  @Output() multiSettingsChosen = new EventEmitter<MultiGameSettings>();

  multiGameSettings: MultiGameSettings = {
    private: false,
  };

  constructor() { }

  ngOnInit() {
  }

  submitSettings() {
    this.multiSettingsChosen.emit(this.multiGameSettings);
  }
}
