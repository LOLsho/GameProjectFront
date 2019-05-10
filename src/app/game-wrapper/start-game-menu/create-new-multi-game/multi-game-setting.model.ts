export interface MultiGameSettings {
  private: boolean;
  maxParticipants: number;
  moveOrder: GameMoveOrder;
}

export type GameMoveOrder = 'no-order' | 'player-by-player' | 'teem-by-teem';
