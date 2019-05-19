import { Action } from '@ngrx/store';


export enum ActionTypes {
  ClearAppState = '[LOGOUT] Clear App State',
}



export class ClearAppState implements Action {
  readonly type = ActionTypes.ClearAppState;
}



// export type AppActions = ClearAppState;
