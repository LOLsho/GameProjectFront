import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth.reducer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../router.serializer';
import { gameListReducer, GameListState } from './games-list.reduces';
import { gameInfoReducer, GameInfoState } from '../../game-wrapper/store/reducers/game-info.reducer';
import { sessionReducer, SessionState } from '../../game-wrapper/store/reducers/session.reducer';
import { stepsReducer, StepsState } from '../../game-wrapper/store/reducers/steps.reducer';
import { sessionListReducer, SessionListState } from '../../game-wrapper/store/reducers/session-list.reducer';


export interface AppState {
  auth: AuthState;
  routerReducer: RouterReducerState<RouterStateUrl>;
  gameList: GameListState;
  gameInfo: GameInfoState;
  session: SessionState;
  sessionList: SessionListState;
  steps: StepsState;
}


export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  routerReducer: routerReducer,
  gameList: gameListReducer,
  gameInfo: gameInfoReducer,
  session: sessionReducer,
  sessionList: sessionListReducer,
  steps: stepsReducer,
};

