import { Action } from '@ngrx/store';


export enum AppActionTypes {
  ClearAppState = '[LOGOUT] Clear App State',
}



export class ClearAppState implements Action {
  readonly type = AppActionTypes.ClearAppState;
}



// export type AppActions = ClearAppState;
