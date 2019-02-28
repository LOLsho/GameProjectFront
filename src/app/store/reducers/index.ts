import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth.reducer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../router.serializer';
import { gameListReducer, GameListState } from './games-list.reduces';
import { sessionReducer, GameState } from '../../game-wrapper/store/reducers/session.reducer';


export interface AppState {
  auth: AuthState;
  routerReducer: RouterReducerState<RouterStateUrl>;
  gameList: GameListState;
  game: GameState;
}


export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  routerReducer: routerReducer,
  gameList: gameListReducer,
  game: sessionReducer,
};

