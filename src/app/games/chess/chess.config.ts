export type ChessPieceName = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';
export type ChessFraction = 'white' | 'black';

export interface ChessConfig {
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
  evenColor: string;
  oddColor: string;
  evenActiveColor: string;
  oddActiveColor: string;
}

export const getChessConfig = (): ChessConfig => ({
  rows: 8,
  columns: 8,
  cellWidth: 87,
  cellHeight: 87,
  evenColor: '#EEEED2',
  oddColor: '#769656',
  evenActiveColor: '#F6F682',
  oddActiveColor: '#BACA44',
});

export interface ChessPieceData {
  name: ChessPieceName;
  fraction: ChessFraction;
  cellId: number;
  hasEverMoved: boolean;
}

export interface ChessStep {
  from: number;
  to: number;
  wasEaten?: ChessPieceData;
  transformation?: ChessPieceName;
}

export const getInitialWhitePieces = (): ChessPieceData[] => [
  { fraction: 'white', name: 'rook', cellId: 56, hasEverMoved: false },
  { fraction: 'white', name: 'rook', cellId: 63, hasEverMoved: false },
  { fraction: 'white', name: 'knight', cellId: 57, hasEverMoved: false },
  { fraction: 'white', name: 'knight', cellId: 62, hasEverMoved: false },
  { fraction: 'white', name: 'bishop', cellId: 58, hasEverMoved: false },
  { fraction: 'white', name: 'bishop', cellId: 61, hasEverMoved: false },
  { fraction: 'white', name: 'queen', cellId: 59, hasEverMoved: false },
  { fraction: 'white', name: 'king', cellId: 60, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 48, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 49, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 50, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 51, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 52, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 53, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 54, hasEverMoved: false },
  { fraction: 'white', name: 'pawn', cellId: 55, hasEverMoved: false },
];

export const getInitialBlackPieces = (): ChessPieceData[] => [
  { fraction: 'black', name: 'rook', cellId: 0, hasEverMoved: false },
  { fraction: 'black', name: 'rook', cellId: 7, hasEverMoved: false },
  { fraction: 'black', name: 'knight', cellId: 1, hasEverMoved: false },
  { fraction: 'black', name: 'knight', cellId: 6, hasEverMoved: false },
  { fraction: 'black', name: 'bishop', cellId: 2, hasEverMoved: false },
  { fraction: 'black', name: 'bishop', cellId: 5, hasEverMoved: false },
  { fraction: 'black', name: 'queen', cellId: 3, hasEverMoved: false },
  { fraction: 'black', name: 'king', cellId: 4, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 8, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 9, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 10, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 11, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 12, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 13, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 14, hasEverMoved: false },
  { fraction: 'black', name: 'pawn', cellId: 15, hasEverMoved: false },
];


