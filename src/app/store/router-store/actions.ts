import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';


export enum ActionTypes {
  RouterGo = '[Router] Go',
  RouterBack = '[Router] Back',
  RouterForward = '[Router] Forward',
}


export class RouterGo implements Action {
  readonly type = ActionTypes.RouterGo;
  constructor(
    public payload: {
      path: any[];
      queryParams?: object;
      extras?: NavigationExtras;
    }
  ) {}
}

export class RouterBack implements Action {
  readonly type = ActionTypes.RouterBack;
}

export class RouterForward implements Action {
  readonly type = ActionTypes.RouterForward;
}



export type RouterActions = RouterGo | RouterBack | RouterForward;
