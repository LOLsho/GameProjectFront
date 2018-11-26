import {Component, OnInit} from '@angular/core';
import {SapperCell, SapperCellState} from './sapper.interface';

@Component({
  selector: 'app-sapper',
  templateUrl: './sapper.component.html',
  styleUrls: ['./sapper.component.scss'],
})
export class SapperComponent implements OnInit {

  field: SapperCell[][] = [];
  defaultFields = {
    small: {
      size: [9, 9],
      amountMines: 10
    },
    medium: {
      size: [16, 16],
      amountMines: 40
    },
    big: {
      size: [30, 16],
      amountMines: 99
    },
  };
  chosenField;

  constructor() {
    this.chosenField = this.defaultFields.big;
  }

  ngOnInit() {
    this.createField();
  }

  createField() {
    this.field = [];
    const mines = [];

    while (mines.length < this.chosenField.amountMines) {
      const mine = Math.floor(Math.random() * (this.chosenField.size[0] * this.chosenField.size[1]));
      if (mines.indexOf(mine) === -1) {
        mines.push(mine);
      }
    }

    const initialCell = {
      state: 'closed' as SapperCellState,
      checked: false,
      number: null,
      hasMine: false,
    };

    // Создаем массив нужного размера, заполненный undefined
    const fieldRow = Array(this.chosenField.size[0]);
    for (let rowIndex = 0; rowIndex < this.chosenField.size[1]; rowIndex++) {
      this.field.push([...fieldRow]);
    }

    // Заполняем массив начальными данными
    for (let rowIndex = 0; rowIndex < this.chosenField.size[1]; rowIndex++) {
      for (let cellIndex = 0; cellIndex < this.chosenField.size[0]; cellIndex++) {
        this.field[rowIndex][cellIndex] = initialCell;
      }
    }

    // Заполняем массив минами
    mines.forEach((mine) => {
      const rowIndex = Math.floor(mine / this.chosenField.size[0]);
      const cellIndex = mine - (rowIndex * this.chosenField.size[0]);
      this.field[rowIndex][cellIndex] = {...initialCell, hasMine: true};
    });
  }

  cellClick() {
    this.createField();
    console.log('this.field - ', this.field);
  }
}
