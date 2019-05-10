import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Language } from 'angular-l10n';
import { MultiGameSettings } from './multi-game-setting.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-new-multi-game',
  templateUrl: './create-new-multi-game.component.html',
  styleUrls: ['./create-new-multi-game.component.scss'],
})
export class CreateNewMultiGameComponent implements OnInit {

  @Language() lang: string;

  @Input() preConfig: Partial<MultiGameSettings>;

  @Output() multiSettingsChosen = new EventEmitter<MultiGameSettings>();

  disabledFields = [];

  moveOrderOptions = [
    { value: 'no-order', caption: 'No order' },
    { value: 'player-by-player', caption: 'Player by player' },
    { value: 'teem-by-teem', caption: 'Teem by teem' },
  ];

  multiGameSettings: MultiGameSettings = {
    private: false,
    maxParticipants: null,
    moveOrder: 'no-order',
  };

  form = this.fb.group({
    private: [false],
    maxParticipants: [{ value: null, disabled: true }, [Validators.required]],
    moveOrder: ['no-order'],
  });

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.disabledFields = Object.keys(this.preConfig);

    this.disabledFields.forEach((fieldName) => {
      const field = this.form.get(fieldName);
      field.setValue(this.preConfig[fieldName]);
      field.disable();
    });
  }

  noRestrictionsClicked(event) {
    if (event.checked) {
      this.form.get('maxParticipants').disable();
    } else {
      this.form.get('maxParticipants').enable();
    }
  }

  submitSettings() {
    this.multiSettingsChosen.emit({...this.form.value, ...this.preConfig});
  }
}
