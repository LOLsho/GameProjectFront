import { Action } from '@ngrx/store';


export const CLEAR_APP_STATE = '[LOGOUT] Clear App State';



export class ClearAppState implements Action {
  readonly type = CLEAR_APP_STATE;
}



// export type AppActions = ClearAppState;
