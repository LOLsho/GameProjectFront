import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SapperCell, SapperField, SapperFieldType, SapperGameData, SapperStep } from './sapper.interfaces';
import { Language, TranslationService } from 'angular-l10n';
import { NotifierService } from 'angular-notifier';
import { Session, Step } from '../../game-wrapper/game.interfaces';
import { User } from '../../auth/auth.interface';
import { createEmptyField, fillEachCell } from '../../../assets/functions/game-functions';


@Component({
  selector: 'app-sapper',
  templateUrl: './sapper.component.html',
  styleUrls: ['./sapper.component.scss'],
})
export class SapperComponent implements OnInit, OnDestroy {

  @Language() lang: string;

  @Input() generateStepData: Function;

  @Input()
  set session(session: Session) {
    this._session = session;
    if (session.gameData.firstCell) {
      if (!this.firstCell) {
        this.updateGame();
      }
    } else {
      this.initGame();
    }
  }

  @Input()
  set step(step: Step<SapperStep>) {
    this.steps.push(step);
    this.lastStep = step; // TODO Do i really need it?
    this.updateCell(step.data.cellId, step.data.clickType);
  }

  @Input() steps: Step<SapperStep>[];
  @Input() userData: User;

  get session() {
    return this._session;
  }

  @Output() sessionUpdated = new EventEmitter<SapperGameData>();
  @Output() sessionFinished = new EventEmitter<SapperGameData>();
  @Output() stepMade = new EventEmitter<Step<SapperStep>>();
  @Output() exitSession = new EventEmitter();

  timer: number;
  timePassed = 0;
  losingSellId: number;
  firstCell: SapperCell;
  field: SapperField = [];

  _session: Session;
  lastStep: Step<SapperStep>;

  chosenField: SapperFieldType;
  initialCell: SapperCell = {
    id: null,
    isOpen: false,
    checked: false,
    number: null,
    hasMine: false,
  };

  constructor(
    private notifierService: NotifierService,
    private translation: TranslationService,
  ) {}

  ngOnInit() {
    this.prepareGame();
  }

  prepareGame() {
    this.steps.forEach((step: Step<SapperStep>) => {
      this.updateCell(step.data.cellId, step.data.clickType);
    });
  }

  updateCell(cellId: number, clickType: 'left' | 'right') {
    const [cellRow, cellColumn] = this.getIndexesFromId(cellId);
    const cell = this.field[cellRow][cellColumn];

    if (clickType === 'left') {
      cell.isOpen = true;
      if (cell.number === 0) this.openCellsAround(cell.id);

      if (cell.hasMine) {
        this.finishGame(cell);
        return;
      }

      if (this.playerWon) {
        this.stopTimer();
        this.makeAllMinesChecked();
        this.notifierService.notify('success', this.translation.translate(`SAPPER_WIN-MESSAGE`));
      }
    } else {
      cell.checked = !cell.checked;
    }
  }

  initGame() {
    this.chosenField = { ...this.session.gameData.chosenField };
    this.createEmptyField();
  }

  updateGame() {
    this.chosenField = this.session.gameData.chosenField;
    this.timePassed = this.session.gameData.timePassed;
    this.firstCell = this.session.gameData.firstCell;
    this.field = JSON.parse(this.session.gameData.field);

    if (!this.timer) this.startTimer();
  }

  restartGame() {
    this.exitSession.emit();

    // TODO delete if there will be no errors
    // this.stopTimer();
    // this.field = [];
    // this.timePassed = 0;
    // this.firstCell = null;
    // this.chosenField = null;
  }

  updateSession() {
    this.sessionUpdated.emit({
      firstCell: this.firstCell,
      field: JSON.stringify(this.field),
      timePassed: this.timePassed,
      chosenField: this.chosenField,
    });
  }

  finishSession() {
    this.sessionFinished.emit({
      firstCell: this.firstCell,
      field: JSON.stringify(this.field),
      timePassed: this.timePassed,
      chosenField: this.chosenField,
    });
  }

  makeStep(id: number, clickType: 'right' | 'left') {
    const step = this.generateStepData({
      cellId: id,
      clickType: clickType
    });

    this.stepMade.emit(step);
  }

  cellClick(cell: SapperCell) {
    // Conditions when you can not click cell
    if (cell.isOpen || cell.checked || this.playerLost || this.playerWon) return;

    // The first click should do the creator. So if not - return
    if (!this.firstCell && this.session.creator.uid !== this.userData.uid) return;

    cell.isOpen = true;
    this.makeStep(cell.id, 'left');

    if (!this.firstCell) {
      cell = this.fillField(cell);
      if (cell.number === 0) this.openCellsAround(cell.id);
      this.startTimer();
      this.updateSession();
    }

    if (cell.hasMine) {
      this.finishGame(cell);
      this.finishSession();
      return;
    }

    if (cell.number === 0) {
      this.openCellsAround(cell.id);
    }

    if (this.playerWon) {
      this.stopTimer();
      this.makeAllMinesChecked();
      this.finishSession();
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
    if (this.playerWon || this.playerLost || !this.firstCell || cell.isOpen) return;
    this.makeStep(cell.id, 'right');
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
    this.field = createEmptyField(this.chosenField.size[1], this.chosenField.size[0]);

    // Заполняем массив начальными данными
    fillEachCell<SapperCell>(this.field, (rowIndex, columnIndex) => {
      return { ...this.initialCell, id: this.getIdFromIndexes(rowIndex, columnIndex) };
    });
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

    this.firstCell = this.field[firstCellRowIndex][firstCellColumnIndex];
    return this.firstCell;
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

  checkAroundCell(rowIndex, columnIndex, action: 'checkMines' | 'openCells', sides?: string[]): number | number[] {
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
