import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Language } from 'angular-l10n';
import { SapperFieldType, SapperFieldTypes } from '../sapper.interface';
import { CustomFieldComponent } from '../custom-field/custom-field.component';
import { filter, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sapper-start-menu',
  templateUrl: './sapper-start-menu.component.html',
  styleUrls: ['./sapper-start-menu.component.scss']
})
export class SapperStartMenuComponent implements OnInit {

  @Language() lang: string;

  @Output() menuClosed = new EventEmitter<any>();

  defaultFields: SapperFieldTypes = {
    small: {
      size: [9, 9],
      amountMines: 10,
    },
    medium: {
      size: [16, 16],
      amountMines: 40,
    },
    big: {
      size: [30, 16],
      amountMines: 99,
    },
  };

  constructor(
    private modal: MatDialog,
  ) { }

  ngOnInit() {}

  chooseField(field: SapperFieldType) {
    this.menuClosed.emit({
      firstCell: false,
      isGameOver: false,
      chosenField: field,
      timePassed: 0,
    });
  }

  makeFieldMyself() {
    const dialogRef = this.modal.open(CustomFieldComponent);

    dialogRef.afterClosed()
      .pipe(
        filter(fieldInfo => !!fieldInfo),
        take(1)
      )
      .subscribe(
        ({ columns, rows, mines }) => {
          const field: SapperFieldType = {
            size: [columns, rows],
            amountMines: mines,
          };
          this.chooseField(field);
        }
      );
  }
}
