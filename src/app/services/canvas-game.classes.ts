// import {
//   createEmptyField,
//   forEachCell, mapField,
// } from '../../assets/functions/game-functions';
// import { SapperCell } from '../games/sapper/sapper.interfaces';
//
// export class CanvasFieldGame {
//
//   ctx: CanvasRenderingContext2D;
//
//   field: Field;
//
//   constructor(canvasElem, fieldConfig: FieldConfig) {
//     this.ctx = canvasElem.getContext('2d');
//     this.field = new Field(this.ctx, fieldConfig);
//     console.log('this.ctx -', this.ctx);
//   }
//
//   drawCircle(x: number, y: number, radius: number, color = 'black') {
//     this.ctx.fillStyle = color;
//     this.ctx.beginPath();
//     this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
//     this.ctx.fill();
//   }
//
//   createField(rows: number, columns: number, config) {
//     const arr: SapperCell[][] = createEmptyField(rows, columns);
//
//     // forEachCell(arr, (cell, rowIndex, columnIndex, self) => {
//     //   this.drawRect(
//     //     rowIndex * config.cellWidth + rowIndex * config.cellGap,
//     //     columnIndex * config.cellHeight + columnIndex * config.cellGap,
//     //     config.cellWidth,
//     //     config.cellHeight
//     //   );
//     // });
//   }
// }
//
// export class Field {
//
//   field: GameField;
//   config: FieldConfig;
//   ctx: CanvasRenderingContext2D;
//
//   constructor(ctx, config: FieldConfig) {
//     this.ctx = ctx;
//     this.config = config;
//     this.field = createEmptyField(config.rows, config.columns);
//     mapField(this.field, (rowIndex, columnIndex) => {
//       return new Cell({
//         id: this.getCellIdFromIndexes(rowIndex, columnIndex),
//       });
//     });
//
//     this.drawField();
//
//
//     console.log('this.field -', this.field);
//   }
//
//   // create
//
//   drawField() {
//     this.drawBackground();
//     this.drawCells();
//   }
//
//   drawCells() {
//     forEachCell(this.field, (cell, rowIndex, columnIndex, self) => {
//       this.drawRect(
//         rowIndex * this.config.cellWidth + rowIndex * this.config.cellGap,
//         columnIndex * this.config.cellHeight + columnIndex * this.config.cellGap,
//         this.config.cellWidth,
//         this.config.cellHeight,
//         'green'
//       );
//     });
//   }
//
//   drawBackground() {
//     if (!this.config.cellGap) return;
//     this.drawRect(
//       0,
//       0,
//       this.config.rows * this.config.cellWidth + this.config.cellGap * (this.config.rows - 1),
//       this.config.columns * this.config.cellHeight + this.config.cellGap * (this.config.rows - 1),
//       this.config.cellGapColor || 'black'
//     );
//   }
//
//   drawRect(x: number, y: number, width: number, height: number, color = 'black') {
//     this.ctx.fillStyle = color;
//     this.ctx.fillRect(x, y, width, height);
//   }
//
//   getCellIdFromIndexes(rowIndex, columnIndex): number {
//     return rowIndex * this.config.columns + columnIndex;
//   }
// }
//
// export class Cell {
//
//   id: number;
//   appearance: CellAppearance;
//   entities: any[];
//   neighborsId: any[];
//
//   constructor(config: CellConfig) {
//     this.id = config.id;
//   }
//
//
// }
//
//
// export type GameField = GameCell[][];
//
// export interface GameCell {
//   id: number;
//   appearance: CellAppearance; // TODO
//   entities: any[];
//   neighborsId?: any[];
// }
//
// export interface CellAppearance {
//   color: string;
// }
//
// export interface FieldConfig {
//   rows: number;
//   columns: number;
//   cellGap: number;
//   cellGapColor?: string;
//   cellWidth: number;
//   cellHeight: number;
// }
//
// export interface CellConfig {
//   id: number;
// }
