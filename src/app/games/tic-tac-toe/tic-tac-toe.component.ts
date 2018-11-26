import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  gameField;
  x = 'x';
  o = 'o';
  empty = 'empty';
  whoseTurn = this.x;
  congratPhrase: string;
  isThereWinner: boolean;
  draw;

  constructor() { }

  ngOnInit() {
    this.setGameField();
  }

  setGameField() {
    this.gameField = Array();
    for (let i = 0; i < 9; i++) {
      this.gameField[i] = {
        index: i,
        value: this.empty
      };
    }
  }

  onCellClick(cell) {
    if (cell.value !== 'empty') return;

    cell.value = this.whoseTurn;

    this.checkDraw();

    this.isThereWinner = this.checkWinner();

    if (this.isThereWinner || this.draw) {
      this.congratWinner();
      this.endGame();
    } else {
      this.changeTurn();
    }
  }

  checkDraw() {
    let isThereEmptyCell: boolean = false;

    this.gameField.forEach((elem) => {
      if (elem.value === this.empty) {
        isThereEmptyCell = true;
      }
    });
    this.draw = !isThereEmptyCell;
  }

  changeTurn() {
    this.whoseTurn = this.whoseTurn === this.x ? this.o : this.x;
  }

  congratWinner() {
    if (this.isThereWinner) {
      this.congratPhrase = `Победили ${this.whoseTurn}!! Поздравляю!!`;
    } else {
      this.congratPhrase = `Ничья!`;
    }
  }

  endGame() {
    setTimeout(() => {
      this.setGameField();
      this.isThereWinner = false;
      this.draw = false;
      this.whoseTurn = this.x;
    }, 3000);
  }

  checkWinner() {
    if (
      this.gameField[0].value === this.x && this.gameField[1].value === this.x && this.gameField[2].value === this.x ||
      this.gameField[0].value === this.o && this.gameField[1].value === this.o && this.gameField[2].value === this.o

  ) {
      return true;
    }

    if (
      this.gameField[3].value === this.x && this.gameField[4].value === this.x && this.gameField[5].value === this.x ||
      this.gameField[3].value === this.o && this.gameField[4].value === this.o && this.gameField[5].value === this.o

    ) {
      return true;
    }

    if (
      this.gameField[6].value === this.x && this.gameField[7].value === this.x && this.gameField[8].value === this.x ||
      this.gameField[6].value === this.o && this.gameField[7].value === this.o && this.gameField[8].value === this.o

    ) {
      return true;
    }

    if (
      this.gameField[0].value === this.x && this.gameField[3].value === this.x && this.gameField[6].value === this.x ||
      this.gameField[0].value === this.o && this.gameField[3].value === this.o && this.gameField[6].value === this.o
    ) {
      return true;
    }

    if (
      this.gameField[1].value === this.x && this.gameField[4].value === this.x && this.gameField[7].value === this.x ||
      this.gameField[1].value === this.o && this.gameField[4].value === this.o && this.gameField[7].value === this.o
    ) {
      return true;
    }

    if (
      this.gameField[2].value === this.x && this.gameField[5].value === this.x && this.gameField[8].value === this.x ||
      this.gameField[2].value === this.o && this.gameField[5].value === this.o && this.gameField[8].value === this.o
    ) {
      return true;
    }

    if (
      this.gameField[0].value === this.x && this.gameField[4].value === this.x && this.gameField[8].value === this.x ||
      this.gameField[0].value === this.o && this.gameField[4].value === this.o && this.gameField[8].value === this.o

    ) {
      return true;
    }

    if (
      this.gameField[2].value === this.x && this.gameField[4].value === this.x && this.gameField[6].value === this.x ||
      this.gameField[2].value === this.o && this.gameField[4].value === this.o && this.gameField[6].value === this.o

    ) {
      return true;
    }

    return false;
  }

}
