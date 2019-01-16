import { Component, OnDestroy, OnInit } from '@angular/core';
import { SapperCell, SapperField, SapperFields } from './sapper.interface';
import { Language } from 'angular-l10n';
import { MatDialog } from '@angular/material';
import { CustomFieldComponent } from './custom-field/custom-field.component';

@Component({
  selector: 'app-sapper',
  templateUrl: './sapper.component.html',
  styleUrls: ['./sapper.component.scss'],
})
export class SapperComponent implements OnInit, OnDestroy {

  @Language() lang: string;

  timer;
  timePassed = 0;
  losingSellId: number;
  firstClick = true;
  field: SapperCell[][] = [];
  defaultFields: SapperFields = {
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
  chosenField: SapperField;
  initialCell: SapperCell = {
    id: null,
    isOpen: false,
    checked: false,
    number: null,
    hasMine: false,
  };

  constructor(
    private modal: MatDialog,
  ) {

  }

  ngOnInit() {

  }

  chooseField(field) {
    this.chosenField = { ...field };
    this.createEmptyField();
  }

  makeFieldMyself() {
    const dialogRef = this.modal.open(CustomFieldComponent);
    console.log('dialogRef -', dialogRef.componentInstance);

    // const rows = Number(prompt('Количество рядов. Мин - 4. Макс - 16'));
    // const columns = Number(prompt('Количество колонок. Мин - 9. Макс - 40'));
    // const amountMines = Number(prompt('Количество мин. Должно быть меньше, чем клеток'));
    //
    // if (!rows || !columns || !amountMines) return;
    //
    // if (rows < 4 || columns < 9) return;
    // if (rows > 16 || columns > 40) return;
    //
    // if (amountMines >= rows * columns || amountMines < 1) return;
    //
    // const field = {
    //   size: [columns, rows],
    //   amountMines: amountMines,
    // };
    //
    // this.chooseField(field);
  }

  restartGame() {
    this.stopTimer();
    this.timePassed = 0;
    this.firstClick = true;
    this.chosenField = null;
  }

  cellClick(cell: SapperCell) {
    if (cell.isOpen || cell.checked || this.gameOver) return;
    cell.isOpen = true;

    if (this.firstClick) {
      this.fillField(cell);
      this.startTimer();
      this.firstClick = false;
    }

    if (cell.hasMine) {
      this.finishGame(cell);
    }

    if (cell.number === 0) {
      // this.openCellsAround(cell.id);
    }

    if (this.playerWon) {
      console.log('in if (this.playerWon)');
      this.stopTimer();
      this.makeAllMinesChacked();
      setTimeout(() => {
        alert('Победа!');
      }, 0);
    }
  }

  makeAllMinesChacked() {
    this.field.forEach(row => row.forEach(item => {
      if (item.hasMine) item.checked = true;
    }));
  }

  finishGame(losingSell?: SapperCell) {
    this.field.forEach(row => row.forEach(item => {
      if (item.hasMine && !item.checked) item.isOpen = true;
    }));
    if (losingSell) this.losingSellId = losingSell.id;
    this.stopTimer();
  }

  rightClick(cell: SapperCell) {
    if (this.gameOver || this.firstClick || cell.isOpen) return;
    cell.checked = !cell.checked;
  }

  openCellsAround(cellId: number) {
    const [rowIndex, columnIndex] = this.getIndexesFromId(cellId);
    const currentCell = this.field[rowIndex][columnIndex];

    // this.
  }

  openEmptyCells(cell: SapperCell) {
    console.log('here!!!');
    const [rowIndex, columnIndex] = this.getIndexesFromId(cell.id);

    const openRow = (rowI, columnI) => {
      let rowsCounter = 1;

      while (columnI - rowsCounter >= 0) {
        this.field[rowI][columnI - rowsCounter].isOpen = true;
        if (this.field[rowI][columnI - rowsCounter].number !== 0 && this.field[rowI][columnI - rowsCounter - 1].number !== 0) break;
        rowsCounter++;
      }

      rowsCounter = 1;

      while (columnI + rowsCounter < this.columnsLength) {
        this.field[rowI][columnI + rowsCounter].isOpen = true;
        if (this.field[rowI][columnI + rowsCounter].number !== 0 && this.field[rowI][columnI + rowsCounter + 1].number !== 0) break;
        rowsCounter++;
      }
    };

    let counter = 0;
    let currentRow;
    while (rowIndex - counter >= 0) {
      currentRow = rowIndex - counter;
      this.field[currentRow][columnIndex].isOpen = true;
      if (this.field[currentRow][columnIndex].number === 0) openRow(currentRow, columnIndex);
      if (this.field[currentRow][columnIndex].number !== 0 && this.field[currentRow - 1][columnIndex].number !== 0) break;
      counter++;
    }

    counter = 1;

    while (rowIndex + counter < this.rowsLength) {
      currentRow = rowIndex + counter;
      this.field[currentRow][columnIndex].isOpen = true;
      if (this.field[currentRow][columnIndex].number === 0) openRow(currentRow, columnIndex);
      if (this.field[currentRow][columnIndex].number !== 0 && this.field[currentRow - 1][columnIndex].number !== 0) break;
      counter++;
    }
  }

  createEmptyField() {
    // Очищаем массив на всякий случай
    this.field = [];

    // Создаем массив нужного размера, заполненный undefined
    const fieldRow = Array(this.chosenField.size[0]);
    for (let rowIndex = 0; rowIndex < this.chosenField.size[1]; rowIndex++) {
      this.field.push([...fieldRow]);
    }

    // Заполняем массив начальными данными
    for (let rowIndex = 0; rowIndex < this.chosenField.size[1]; rowIndex++) {
      for (let cellIndex = 0; cellIndex < this.chosenField.size[0]; cellIndex++) {
        this.field[rowIndex][cellIndex] = { ...this.initialCell, id: rowIndex * this.columnsLength + cellIndex };
      }
    }
  }

  fillField(firstClickedCell) {
    const mines = [];

    // Создаем необходимое количество мин с рандомными индексами
    while (mines.length < this.chosenField.amountMines) {
      const mineNumber = Math.floor(Math.random() * (this.chosenField.size[0] * this.chosenField.size[1]));
      if (mineNumber === firstClickedCell.id) continue;
      if (mines.indexOf(mineNumber) === -1) {
        mines.push(mineNumber);
      }
    }

    // Заполняем поле минами
    mines.forEach((mineNumber) => {
      const [rowIndex, cellIndex] = this.getIndexesFromId(mineNumber);
      this.field[rowIndex][cellIndex] = { ...this.initialCell, hasMine: true, id: mineNumber };
    });

    // Определяем номер для каждой клетки
    this.field = this.field.map((row, rowIndex) => {
      return row.map((cell: SapperCell, columnIndex) => {
        if (cell.hasMine) return { ...cell, number: null };

        const minesAround = this.checkAvailableCells(rowIndex, columnIndex, 'checkMines');
        return { ...cell, number: minesAround };
      });
    });
  }

  checkAvailableCells(rowIndex, columnIndex, action: 'checkMines' | 'openCells') {
    let minesAround = 0;

    if (rowIndex === 0 && columnIndex === 0) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['r', 'br', 'b']);
    } else if (rowIndex === 0 && columnIndex !== 0 && columnIndex !== this.columnsLength - 1) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['r', 'br', 'b', 'bl', 'l']);
    } else if (rowIndex === 0 && columnIndex === this.columnsLength - 1) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['b', 'bl', 'l']);
    } else if (rowIndex !== 0 && rowIndex !== this.rowsLength - 1 && columnIndex === this.columnsLength - 1) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['b', 'bl', 'l', 'tl', 't']);
    } else if (rowIndex === this.rowsLength - 1 && columnIndex === this.columnsLength - 1) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['l', 'tl', 't']);
    } else if (rowIndex === this.rowsLength - 1 && columnIndex !== 0 && columnIndex !== this.columnsLength - 1) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['l', 'tl', 't', 'tr', 'r']);
    } else if (rowIndex === this.rowsLength - 1 && columnIndex === 0) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['t', 'tr', 'r']);
    } else if (rowIndex !== 0 && rowIndex !== this.rowsLength - 1 && columnIndex === 0) {
      minesAround = this.checkAroundCell(rowIndex, columnIndex, ['t', 'tr', 'r', 'br', 'b']);
    } else {
      minesAround = this.checkAroundCell(rowIndex, columnIndex);
    }

    return action === 'checkMines' ? minesAround : null;
  }

  checkAroundCell(rowIndex, columnIndex, sides?) {
    let minesAround = 0;
    const sidesToCheck = sides || ['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l'];

    sidesToCheck.forEach(side => {
      switch (side) {
        case 'tl':
          if (this.field[rowIndex - 1][columnIndex - 1].hasMine) minesAround++;
          break;
        case 't':
          if (this.field[rowIndex - 1][columnIndex].hasMine) minesAround++;
          break;
        case 'tr':
          if (this.field[rowIndex - 1][columnIndex + 1].hasMine) minesAround++;
          break;
        case 'r':
          if (this.field[rowIndex][columnIndex + 1].hasMine) minesAround++;
          break;
        case 'br':
          if (this.field[rowIndex + 1][columnIndex + 1].hasMine) minesAround++;
          break;
        case 'b':
          if (this.field[rowIndex + 1][columnIndex].hasMine) minesAround++;
          break;
        case 'bl':
          if (this.field[rowIndex + 1][columnIndex - 1].hasMine) minesAround++;
          break;
        case 'l':
          if (this.field[rowIndex][columnIndex - 1].hasMine) minesAround++;
          break;
      }
    });

    return minesAround;
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timePassed++;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  getIndexesFromId(id: number) {
    const rowIndex = Math.floor(id / this.columnsLength);
    const columnIndex = id - (rowIndex * this.columnsLength);
    return [rowIndex, columnIndex];
  }

  get rowsLength() {
    return this.chosenField.size[1];
  }

  get columnsLength() {
    return this.chosenField.size[0];
  }

  get gameOver() {
    for (let rowIndex = 0; rowIndex < this.rowsLength; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.rowsLength; columnIndex++) {
        const currentCell = this.field[rowIndex][columnIndex];
        if (currentCell.hasMine && currentCell.isOpen) return true;
      }
    }
  }

  get unclearedMines() {
    let clearedMines = 0;

    this.field.forEach(row => row.forEach(cell => {
      if (cell.checked) clearedMines++;
    }));

    return this.chosenField.amountMines - clearedMines;
  }

  testVar;
  counter = 0;

  get playerWon() {
    for (let rowIndex = 0; rowIndex < this.rowsLength; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.rowsLength; columnIndex++) {
        this.counter++;
        const currentCell = this.field[rowIndex][columnIndex];
        this.testVar = currentCell;
        if (!currentCell.hasMine && !currentCell.isOpen) {
          this.counter = 0;
          return false;
        } else {

        }
      }
    }

    console.log('this.field - ', this.field);
    console.log('this.counter - ', this.counter);
    console.log('currentCell - ', this.testVar);
    console.log('!currentCell.hasMine && !currentCell.isOpen - ', !this.testVar.hasMine && !this.testVar.isOpen);

    return true;
  }

  getNumberStyle(cell) {
    return {
      'color': cell.number === 1 ? '#1B00FF' :
        cell.number === 2 ? '#008000' :
          cell.number === 3 ? '#FF0200' :
            cell.number === 4 ? '#080080' :
              cell.number === 5 ? '#800000' :
                cell.number === 6 ? '#218282' : '',
    };
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
