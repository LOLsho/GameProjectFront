import { Session } from '../../game-wrapper/game.interfaces';


export type SessionState = Session;

export const initialState: SessionState = {
  id: null,
  created: null,
  creatorId: null,
  gameData: null,
  gameMode: null,
  isSessionOver: null,
};
