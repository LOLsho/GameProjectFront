import { Action } from '@ngrx/store';
import { AuthWithEmailAndPasswordData, User } from '../../auth/auth.interface';


export const GET_USER = '[Auth] Get User';

export const EMAIL_AND_PASSWORD_REGISTER = '[Auth] Email And Password Register Attempt';
export const EMAIL_AND_PASSWORD_LOGIN = '[Auth] Email And Password Login Attempt';
export const GOOGLE_LOGIN = '[Auth] Google Login Attempt';
export const FACEBOOK_LOGIN = '[Auth] Facebook Login Attempt';
export const GITHUB_LOGIN = '[Auth] Github Login Attempt';

export const AUTHENTICATED = '[Auth] User Authenticated';
export const NOT_AUTHENTICATED = '[Auth] User Not Authenticated';

export const LOGOUT = '[Auth] Logout';
export const LOGOUT_SUCCESS = '[Auth] Logout Success';

export const AUTH_FAIL = '[Auth] Fail';



export class GetUser implements Action {
  readonly type = GET_USER;
}

export class EmailAndPasswordLogin implements Action {
  readonly type = EMAIL_AND_PASSWORD_LOGIN;
  constructor(public payload: AuthWithEmailAndPasswordData) {}
}

export class EmailAndPasswordRegister implements Action {
  readonly type = EMAIL_AND_PASSWORD_REGISTER;
  constructor(public payload: AuthWithEmailAndPasswordData) {}
}

export class GoogleLogin implements Action {
  readonly type = GOOGLE_LOGIN;
}

export class FacebookLogin implements Action {
  readonly  type = FACEBOOK_LOGIN;
}

export class GithubLogin implements Action {
  readonly  type = GITHUB_LOGIN;
}

export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public payload: User) {}
}

export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
  constructor(public payload?: User) {}
}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL;
  constructor(public payload?: any) {}
}



export type AuthActions =
  | GetUser
  | EmailAndPasswordRegister
  | EmailAndPasswordLogin
  | GoogleLogin
  | FacebookLogin
  | GithubLogin
  | Authenticated
  | NotAuthenticated
  | Logout
  | AuthFail
  | LogoutSuccess;
