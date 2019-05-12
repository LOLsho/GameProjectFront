import { Action } from '@ngrx/store';
import { AuthWithEmailAndPasswordData, User } from '../../auth/auth.interface';


export enum AuthActionTypes {
  GetUser = '[Auth] Get User',
  SetUser = '[Auth] Set Authenticated And Parsed User',

  UpdateUserName = '[App] Update User Name',

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
  readonly type = AuthActionTypes.GetUser;
}

export class SetUser implements Action {
  readonly type = AuthActionTypes.SetUser;
  constructor(public payload: User) {}
}

export class UpdateUserName implements Action {
  readonly type = AuthActionTypes.UpdateUserName;
  constructor(public payload: { name: string }) {}
}

export class EmailAndPasswordLogin implements Action {
  readonly type = AuthActionTypes.EmailAndPasswordLogin;
  constructor(public payload: AuthWithEmailAndPasswordData) {}
}

export class EmailAndPasswordRegister implements Action {
  readonly type = AuthActionTypes.EmailAndPasswordRegister;
  constructor(public payload: AuthWithEmailAndPasswordData) {}
}

export class GoogleLogin implements Action {
  readonly type = AuthActionTypes.GoogleLogin;
}

export class FacebookLogin implements Action {
  readonly type = AuthActionTypes.FacebookLogin;
}

export class GithubLogin implements Action {
  readonly type = AuthActionTypes.GithubLogin;
}

export class NewUserRegistered implements Action {
  readonly type = AuthActionTypes.NewUserRegistered;
  constructor(public payload: User) {}
}

export class Authenticated implements Action {
  readonly type = AuthActionTypes.Authenticated;
  constructor(public payload: Partial<User>) {}
}

export class NotAuthenticated implements Action {
  readonly type = AuthActionTypes.NotAuthenticated;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionTypes.LogoutSuccess;
  constructor(public payload?: Partial<User>) {}
}

export class AuthFail implements Action {
  readonly type = AuthActionTypes.AuthFail;
  constructor(public payload?: any) {}
}



export type AuthActions =
  | GetUser
  | UpdateUserName
  | EmailAndPasswordRegister
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
