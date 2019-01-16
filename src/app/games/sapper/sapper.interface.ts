export interface SapperCell {
  id: number;
  isOpen: boolean;
  checked: boolean;
  number: number;
  hasMine: boolean;
}

export interface SapperFields {
  [fieldSize: string]: SapperField;
}

export interface SapperField {
  size: [number, number];
  amountMines: number;
}
