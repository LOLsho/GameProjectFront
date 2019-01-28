import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';


export const ROUTER_GO = '[Router] Go';
export const ROUTER_BACK = '[Router] Back';
export const ROUTER_FORWARD = '[Router] Forward';



export class RouterGo implements Action {
  readonly type = ROUTER_GO;
  constructor(
    public payload: {
      path: any[];
      queryParams?: object;
      extras?: NavigationExtras;
    }
  ) {}
}

export class RouterBack implements Action {
  readonly type = ROUTER_BACK;
}

export class RouterForward implements Action {
  readonly type = ROUTER_FORWARD;
}



export type RouterActions = RouterGo | RouterBack | RouterForward;
