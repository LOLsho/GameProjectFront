import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SapperCell, SapperField, SapperFieldType, SapperFieldTypes } from './sapper.interface';
import { Language, TranslationService } from 'angular-l10n';
import { MatDialog } from '@angular/material';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { NotifierService } from 'angular-notifier';
import { filter } from 'rxjs/operators';
import { GameSettings } from '../../game-wrapper/game.interfaces';


@Component({
  selector: 'app-sapper',
  templateUrl: './sapper.component.html',
  styleUrls: ['./sapper.component.scss'],
})
export class SapperComponent implements OnInit, OnDestroy {

  @Language() lang: string;

  @Input() gameSettings: GameSettings;

  @Output() gameCreated = new EventEmitter<{
    firstClick: boolean;
    field: string;
    isGameOver: boolean;
    timePassed: number;
  }>();

  @Output() gameUpdated = new EventEmitter<{
    firstClick: boolean;
    field: string;
    isGameOver: boolean;
    timePassed: number;
  }>();

  @Output() step = new EventEmitter<{
    cellId: number;
    // user: string; // TODO
    // timeStamp: number; // TODO
  }>();

  gameSteps: { cellId: number }[] = [];


  timer: number;
  timePassed = 0;
  losingSellId: number;
  firstClick = true;
  field: SapperField = [];

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
  chosenField: SapperFieldType;
  initialCell: SapperCell = {
    id: null,
    isOpen: false,
    checked: false,
    number: null,
    hasMine: false,
  };

  constructor(
    private modal: MatDialog,
    private notifierService: NotifierService,
    private translation: TranslationService,
  ) {}

  ngOnInit() {

  }

  initGame() {
    this.createEmptyField();
    this.gameCreated.emit({
      firstClick: this.firstClick,
      field: JSON.stringify(this.field),
      isGameOver: this.playerWon || this.playerLost,
      timePassed: this.timePassed,
    });
  }

  chooseField(field: SapperFieldType) {
    this.chosenField = { ...field };
    this.initGame();
  }

  makeFieldMyself() {
    const dialogRef = this.modal.open(CustomFieldComponent);

    dialogRef.afterClosed()
      .pipe(filter(fieldInfo => !!fieldInfo))
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

  restartGame() {
    this.stopTimer();
    this.timePassed = 0;
    this.firstClick = true;
    this.chosenField = null;
  }

  updateGameState() {
    this.gameUpdated.emit({
      firstClick: this.firstClick,
      field: JSON.stringify(this.field),
      isGameOver: this.playerWon || this.playerLost,
      timePassed: this.timePassed,
    });
  }

  makeStep(id: number) {
    this.step.emit({ cellId: id });
  }

  cellClick(cell: SapperCell) {
    if (cell.isOpen || cell.checked || this.playerLost || this.playerWon) return;
    cell.isOpen = true;
    // this.makeStep(cell.id); // TODO

    if (this.firstClick) {
      cell = this.fillField(cell);
      this.startTimer();
      this.firstClick = false;
      this.updateGameState();
    }

    if (cell.hasMine) {
      this.finishGame(cell);
      this.updateGameState();
      return;
    }

    if (cell.number === 0) {
      this.openCellsAround(cell.id);
    }

    if (this.playerWon) {
      this.stopTimer();
      this.makeAllMinesChecked();
      this.updateGameState();
      this.notifierService.notify('success', this.translation.translate(`SAPPER_WIN-MESSAGE`));
    }
  }

  makeAllMinesChecked() {
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
    if (this.playerWon || this.playerLost || this.firstClick || cell.isOpen) return;
    cell.checked = !cell.checked;
  }

  openCellsAround(cellIds: number[] | number) {
    if (cellIds === undefined) return;
    if (!Array.isArray(cellIds)) cellIds = [cellIds];
    if (cellIds.length === 0) return;

    for (const cellId of cellIds) {
      const [rowIndex, columnIndex] = this.getIndexesFromId(cellId);
      const otherIdsToOpen: number | number[] = this.checkAvailableCells(rowIndex, columnIndex, 'openCells');
      this.openCellsAround(otherIdsToOpen);
    }
  }

  createEmptyField() {
    if (!this.chosenField) return;
    // Очищаем массив на всякий случай
    this.field = [];

    // Создаем массив нужного размера, заполненный undefined
    const fieldRow = Array(this.chosenField.size[0]);
    for (let rowIndex = 0; rowIndex < this.chosenField.size[1]; rowIndex++) {
      this.field.push([...fieldRow]);
    }

    // Заполняем массив начальными данными
    for (let rowIndex = 0; rowIndex < this.chosenField.size[1]; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.chosenField.size[0]; columnIndex++) {
        this.field[rowIndex][columnIndex] = { ...this.initialCell, id: this.getIdFromIndexes(rowIndex, columnIndex) };
      }
    }
  }

  fillField(firstClickedCell) {
    const mines = [];
    const [firstCellRowIndex, firstCellColumnIndex] = this.getIndexesFromId(firstClickedCell.id);

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

        const minesAround = this.checkAvailableCells(rowIndex, columnIndex, 'checkMines') as number;
        return { ...cell, number: minesAround };
      });
    });

    return this.field[firstCellRowIndex][firstCellColumnIndex];
  }

  checkAvailableCells(rowIndex, columnIndex, action: 'checkMines' | 'openCells') {
    let result: number | number[];

    if (rowIndex === 0 && columnIndex === 0) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['r', 'br', 'b']);
    } else if (rowIndex === 0 && columnIndex !== 0 && columnIndex !== this.columnsLength - 1) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['r', 'br', 'b', 'bl', 'l']);
    } else if (rowIndex === 0 && columnIndex === this.columnsLength - 1) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['b', 'bl', 'l']);
    } else if (rowIndex !== 0 && rowIndex !== this.rowsLength - 1 && columnIndex === this.columnsLength - 1) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['b', 'bl', 'l', 'tl', 't']);
    } else if (rowIndex === this.rowsLength - 1 && columnIndex === this.columnsLength - 1) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['l', 'tl', 't']);
    } else if (rowIndex === this.rowsLength - 1 && columnIndex !== 0 && columnIndex !== this.columnsLength - 1) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['l', 'tl', 't', 'tr', 'r']);
    } else if (rowIndex === this.rowsLength - 1 && columnIndex === 0) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['t', 'tr', 'r']);
    } else if (rowIndex !== 0 && rowIndex !== this.rowsLength - 1 && columnIndex === 0) {
      result = this.checkAroundCell(rowIndex, columnIndex, action, ['t', 'tr', 'r', 'br', 'b']);
    } else {
      result = this.checkAroundCell(rowIndex, columnIndex, action);
    }

    return result;
  }

  checkAroundCell(rowIndex, columnIndex, action: 'checkMines' | 'openCells', sides?): number | number[] {
    let minesAround = 0; // TODO smart refactor with collbacks
    const otherIdsToOpen: number[] = [];
    const sidesToCheck = sides || ['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l'];

    let searchedCell: SapperCell;
    sidesToCheck.forEach(side => {
      switch (side) {
        case 'tl':
          searchedCell = this.field[rowIndex - 1][columnIndex - 1];
          if (action === 'checkMines') {
            // Записываем сколько мин вокруг клетки
            if (searchedCell.hasMine) minesAround++;
          } else {
            // Записываем пустые (!и закрытые!) клетки для последующего открытия
            if (searchedCell.number === 0 && !searchedCell.isOpen) {
              otherIdsToOpen.push(searchedCell.id);
            }
            // Открываем данную клетку
            searchedCell.isOpen = true;
          }
          break;
        case 't':
          searchedCell = this.field[rowIndex - 1][columnIndex];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
        case 'tr':
          searchedCell = this.field[rowIndex - 1][columnIndex + 1];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
        case 'r':
          searchedCell = this.field[rowIndex][columnIndex + 1];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
        case 'br':
          searchedCell = this.field[rowIndex + 1][columnIndex + 1];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
        case 'b':
          searchedCell = this.field[rowIndex + 1][columnIndex];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
        case 'bl':
          searchedCell = this.field[rowIndex + 1][columnIndex - 1];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
        case 'l':
          searchedCell = this.field[rowIndex][columnIndex - 1];
          if (action === 'checkMines') {
            if (searchedCell.hasMine) minesAround++;
          } else {
            if (searchedCell.number === 0 && !searchedCell.isOpen) otherIdsToOpen.push(searchedCell.id);
            searchedCell.isOpen = true;
          }
          break;
      }
    });

    return action === 'checkMines' ? minesAround : otherIdsToOpen;
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

  getIdFromIndexes(rowIndex, columnIndex): number {
    return rowIndex * this.columnsLength + columnIndex;
  }

  get rowsLength() {
    return this.chosenField.size[1];
  }

  get columnsLength() {
    return this.chosenField.size[0];
  }

  get playerLost() {
    for (let rowIndex = 0; rowIndex < this.rowsLength; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.rowsLength; columnIndex++) {
        const currentCell = this.field[rowIndex][columnIndex];
        if (currentCell.hasMine && currentCell.isOpen) return true;
      }
    }

    return false;
  }

  get unclearedMines() {
    let clearedMines = 0;

    this.field.forEach(row => row.forEach(cell => {
      if (cell.checked) clearedMines++;
    }));

    return this.chosenField.amountMines - clearedMines;
  }

  get playerWon() {
    for (let rowIndex = 0; rowIndex < this.rowsLength; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columnsLength; columnIndex++) {
        const currentCell = this.field[rowIndex][columnIndex];
        if (!currentCell.hasMine && !currentCell.isOpen) {
          return false;
        }
      }
    }

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
