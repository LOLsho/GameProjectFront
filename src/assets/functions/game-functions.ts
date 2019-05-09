export type forEachCellCallbackFn<T> = (cell: T, rowIndex: number, columnIndex: number, field: T[][]) => void;
export type fillEachCellCallbackFn<T> = (rowIndex: number, columnIndex: number, cell: T) => T;

export function createEmptyField(rows: number, columns: number) {
  const field = [];

  const fieldRow = Array(rows);
  for (let rowIndex = 0; rowIndex < columns; rowIndex++) {
    field.push([...fieldRow]);
  }

  return field;
}

export function createAndFillField(rows: number, columns: number, filler: any) {
  const field = createEmptyField(rows, columns);
  fillEachCell(field, () => filler);
  return field;
}

export function forEachCell<T>(field: T[][], callback: forEachCellCallbackFn<T>) {
  const rows = field.length;
  const columns = field[0].length;

  for (let rowIndex = 0; rowIndex < columns; rowIndex++) {
    for (let columnIndex = 0; columnIndex < rows; columnIndex++) {
      callback(field[rowIndex][columnIndex], rowIndex, columnIndex, field);
    }
  }
}

export function fillEachCell<T>(field: any[][], callback: fillEachCellCallbackFn<T>) {
  const rows = field.length;
  const columns = field[0].length;

  for (let rowIndex = 0; rowIndex < columns; rowIndex++) {
    for (let columnIndex = 0; columnIndex < rows; columnIndex++) {
      const mapped = callback(rowIndex, columnIndex, field[rowIndex][columnIndex]);
      field[rowIndex][columnIndex] = mapped;
    }
  }
}

