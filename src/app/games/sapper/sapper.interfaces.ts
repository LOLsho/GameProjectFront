export interface SapperCell {
  id: number;
  isOpen: boolean;
  checked: boolean;
  number: number;
  hasMine: boolean;
}

export interface SapperFieldTypes {
  small: SapperFieldType;
  medium: SapperFieldType;
  big: SapperFieldType;
}

export interface SapperFieldType {
  size: [number, number];
  amountMines: number;
}

export type SapperField = SapperCell[][];


export interface SapperGameData {
  firstCell: SapperCell;
  field: string;
  timePassed: number;
  chosenField: SapperFieldType;
}

export interface SapperStep {
  clickType: 'left' | 'right';
  cellId: number;
}
