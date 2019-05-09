import { Component, Input, OnInit } from '@angular/core';
import { ChessConfig, ChessFraction, ChessPieceName } from '../chess.config';

@Component({
  selector: 'app-chess-piece',
  templateUrl: './chess-piece.component.html',
  styleUrls: ['./chess-piece.component.scss'],
})
export class ChessPieceComponent implements OnInit {

  @Input() readonly fraction: ChessFraction;
  @Input() readonly name: ChessPieceName;
  @Input() readonly config: ChessConfig;

  @Input()
  set cellId(value: number) {
    const [rowIndex, colIndex] = this.getIndexesFromId(value);

    this.posX = colIndex * this.config.cellWidth;
    this.posY = rowIndex * this.config.cellHeight;
  }

  posX: number;
  posY: number;

  id: number;

  constructor() { }

  ngOnInit() {

  }

  getIndexesFromId(id: number) {
    const rowIndex = Math.floor(id / this.config.columns);
    const columnIndex = id - (rowIndex * this.config.columns);
    return [rowIndex, columnIndex];
  }
}
