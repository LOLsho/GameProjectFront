import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';


export enum RouterActionTypes {
  RouterGo = '[Router] Go',
  RouterBack = '[Router] Back',
  RouterForward = '[Router] Forward',
}


export class RouterGo implements Action {
  readonly type = RouterActionTypes.RouterGo;
  constructor(
    public payload: {
      path: any[];
      queryParams?: object;
      extras?: NavigationExtras;
    }
  ) {}
}

export class RouterBack implements Action {
  readonly type = RouterActionTypes.RouterBack;
}

export class RouterForward implements Action {
  readonly type = RouterActionTypes.RouterForward;
}



export type RouterActions = RouterGo | RouterBack | RouterForward;
