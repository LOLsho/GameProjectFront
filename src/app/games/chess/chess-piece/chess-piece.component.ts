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
  @Input() readonly cellId: number;
  @Input() readonly upsideDown: boolean;

  constructor() { }

  ngOnInit() {}

  get posX(): number {
    const rowIndex = Math.floor(this.cellId / this.config.columns);
    const colIndex = this.cellId - (rowIndex * this.config.columns);
    return colIndex * this.config.cellWidth;
  }

  get posY(): number {
    const rowIndex = Math.floor(this.cellId / this.config.columns);
    return rowIndex * this.config.cellHeight;
  }
}
