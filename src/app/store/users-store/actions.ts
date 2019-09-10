import { Action } from '@ngrx/store';
import { User } from '../../auth/auth.interface';


export enum UsersActionType {
  LoadUser = '[USERS] Load User',
  SetLoadedUser = '[USERS] Set Loaded User',

  UpdateUser = '[USERS] Update User',
}


export class LoadUser implements Action {
  readonly type = UsersActionType.LoadUser;
  constructor(public payload: { id: string }) {}
}

export class SetLoadedUser implements Action {
  readonly type = UsersActionType.SetLoadedUser;
  constructor(public payload: User) {}
}

export class UpdateUser implements Action {
  readonly type = UsersActionType.UpdateUser;
  constructor(public payload: { id: string, data: Partial<User> }) {}
}


export type UsersActions =
  | LoadUser
  | SetLoadedUser
  | UpdateUser;
