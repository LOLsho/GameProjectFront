export interface SapperRow {
  sells: SapperCell[];
}

export interface SapperCell {
  state: SapperCellState;
  checked: boolean;
  number: number;
  hasMine: boolean;
}

export type SapperCellState = 'opened' | 'closed';
