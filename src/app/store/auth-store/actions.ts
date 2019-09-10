import { Action } from '@ngrx/store';
import { AuthWithEmailAndPasswordData, User } from '../../auth/auth.interface';


export enum ActionTypes {
  GetUser = '[Auth] Get User',
  SetUser = '[Auth] Set Authenticated And Parsed User',

  ReloadAuthUser = '[Auth] Reload User',

  EmailAndPasswordRegister = '[Auth] Email And Password Register Attempt',
  EmailAndPasswordLogin = '[Auth] Email And Password Login Attempt',
  GoogleLogin = '[Auth] Google Login Attempt',
  FacebookLogin = '[Auth] Facebook Login Attempt',
  GithubLogin = '[Auth] Github Login Attempt',

  NewUserRegistered = '[FIRESTORE API] New User Registered',

  Authenticated = '[Auth] User Authenticated',
  NotAuthenticated = '[Auth] User Not Authenticated',

  Logout = '[Auth] Logout',
  LogoutSuccess = '[Auth] Logout Success',

  AuthFail = '[Auth] Fail',
}


export class GetUser implements Action {
  readonly type = ActionTypes.GetUser;
}

export class SetUser implements Action {
  readonly type = ActionTypes.SetUser;
  constructor(public payload: User) {}
}

export class ReloadAuthUser implements Action {
  readonly type = ActionTypes.ReloadAuthUser;
}

export class EmailAndPasswordLogin implements Action {
  readonly type = ActionTypes.EmailAndPasswordLogin;
  constructor(public payload: AuthWithEmailAndPasswordData) {}
}

export class EmailAndPasswordRegister implements Action {
  readonly type = ActionTypes.EmailAndPasswordRegister;
  constructor(public payload: AuthWithEmailAndPasswordData) {}
}

export class GoogleLogin implements Action {
  readonly type = ActionTypes.GoogleLogin;
}

export class FacebookLogin implements Action {
  readonly type = ActionTypes.FacebookLogin;
}

export class GithubLogin implements Action {
  readonly type = ActionTypes.GithubLogin;
}

export class NewUserRegistered implements Action {
  readonly type = ActionTypes.NewUserRegistered;
  constructor(public payload: User) {}
}

export class Authenticated implements Action {
  readonly type = ActionTypes.Authenticated;
  constructor(public payload: Partial<User>) {}
}

export class NotAuthenticated implements Action {
  readonly type = ActionTypes.NotAuthenticated;
}

export class Logout implements Action {
  readonly type = ActionTypes.Logout;
}

export class LogoutSuccess implements Action {
  readonly type = ActionTypes.LogoutSuccess;
  constructor(public payload?: Partial<User>) {}
}

export class AuthFail implements Action {
  readonly type = ActionTypes.AuthFail;
  constructor(public payload?: any) {}
}



export type Actions =
  | GetUser
  | EmailAndPasswordRegister
  | ReloadAuthUser
  | EmailAndPasswordLogin
  | GoogleLogin
  | FacebookLogin
  | GithubLogin
  | Authenticated
  | NotAuthenticated
  | Logout
  | AuthFail
  | NewUserRegistered
  | SetUser
  | LogoutSuccess;
