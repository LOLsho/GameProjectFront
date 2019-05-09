import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Language } from 'angular-l10n';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.scss']
})
export class CustomFieldComponent implements OnInit {

  @Language() lang;

  form = this.fb.group({
    rows: [9, [Validators.required, Validators.min(4), Validators.max(16)]],
    columns: [9, [Validators.required, Validators.min(9), Validators.max(40)]],
    mines: [10, [Validators.required, Validators.min(1), Validators.max(80)]]
  });

  constructor(
    private fb: FormBuilder,
    private modal: MatDialogRef<CustomFieldComponent>,
  ) {}

  ngOnInit() {}

  onRowsInput(input) {
    const rows = input.target.value;

    this.form.get('mines')
      .setValidators(Validators.max(
        this.getMaxMines(rows, this.form.get('columns').value)
      ));

    this.form.get('mines').setValue(((rows * this.form.get('columns').value / 3).toFixed(0)));
  }

  onColumnsInput(input) {
    const columns = input.target.value;

    this.form.get('mines')
      .setValidators(Validators.max(
        this.getMaxMines(this.form.get('rows').value, columns)
      ));

    this.form.get('mines').setValue(((this.form.get('rows').value * columns) / 3).toFixed(0));
  }

  submitField() {
    this.modal.close(this.form.value);
  }

  getMaxMines(rows, columns) {
    const cellsAmount = rows * columns;
    return cellsAmount - 1;
  }
}
