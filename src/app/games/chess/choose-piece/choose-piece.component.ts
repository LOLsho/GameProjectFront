import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { createEmptyField } from '../../../../assets/functions/game-functions';
import { ChessConfig, ChessFraction } from '../chess.config';

@Component({
  selector: 'app-choose-piece',
  templateUrl: './choose-piece.component.html',
  styleUrls: ['./choose-piece.component.scss'],
})
export class ChoosePieceComponent implements OnInit {

  field = createEmptyField(2, 2);
  config: ChessConfig;

  piecesToChoose = [
    { id: 0, name: 'queen' },
    { id: 1, name: 'rook' },
    { id: 2, name: 'knight' },
    { id: 3, name: 'bishop' },
  ];
  fraction: ChessFraction;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private modal: MatDialogRef<ChoosePieceComponent>,
  ) { }

  ngOnInit() {
    this.config = {...this.data.config};
    this.config.rows = 2;
    this.config.columns = 2;
    this.fraction = this.data.fraction;
  }

  getCellBackground(rowIndex: number, colIndex: number): string {
    return (rowIndex + colIndex) % 2 === 0 ? this.config.evenColor : this.config.oddColor;
  }

  pieceChosen(piece) {
    this.modal.close(piece.name);
  }
}
