import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth.reducer';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../router.serializer';


export interface AppState {
  auth: AuthState;
  routerReducer: RouterReducerState<RouterStateUrl>;
}


export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  routerReducer: routerReducer,

};

