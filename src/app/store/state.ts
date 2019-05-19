import { RouterState } from '@store/router-store/state';
import { AuthState } from '@store/auth-store/state';
import { GameInfoState } from '@store/game-info-store/state';
import { GameListState } from '@store/game-list-store/state';
import { SessionState } from '@store/session-store/state';
import { SessionListState } from '@store/session-list-store/state';
import { StepsState } from '@store/steps-store/state';


export interface AppState {
  router: RouterState;
  auth: AuthState;
  gameInfo: GameInfoState;
  gameList: GameListState;
  session: SessionState;
  sessionList: SessionListState;
  steps: StepsState;
}
