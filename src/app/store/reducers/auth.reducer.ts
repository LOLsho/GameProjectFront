import { defaultUser, User } from '../../auth/auth.interface';
import { AuthActions, AuthActionTypes } from '../actions/auth.actions';


export interface AuthState {
  user: User;
  pending: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  pending: false,
};

export function authReducer(state: AuthState = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {

    case AuthActionTypes.GetUser:
    case AuthActionTypes.EmailAndPasswordRegister:
    case AuthActionTypes.EmailAndPasswordLogin:
    case AuthActionTypes.GoogleLogin:
    case AuthActionTypes.FacebookLogin:
    case AuthActionTypes.GithubLogin:
    case AuthActionTypes.Logout:
    case AuthActionTypes.Authenticated:
      return { ...state, pending: true };

    case AuthActionTypes.SetUser:
      return { ...state, user: action.payload, pending: false };

    case AuthActionTypes.NotAuthenticated:
    case AuthActionTypes.LogoutSuccess:
      return { ...state, user: defaultUser, pending: false };

    case AuthActionTypes.AuthFail:
    case AuthActionTypes.NewUserRegistered:
      return { ...state, pending: false };
  }

  return state;
}


export const selectUser = (state: AuthState) => state.user;
export const selectAuthPending = (state: AuthState) => state.pending;
