export interface SapperCell {
  id: number;
  isOpen: boolean;
  checked: boolean;
  number: number;
  hasMine: boolean;
}

export interface SapperFieldTypes {
  [fieldSize: string]: SapperFieldType;
}

export interface SapperFieldType {
  size: [number, number];
  amountMines: number;
}

export type SapperField = SapperCell[][];
