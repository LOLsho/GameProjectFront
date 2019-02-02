import { defaultUser, User } from '../../auth/auth.interface';
import {
  AUTH_FAIL,
  AuthActions, AUTHENTICATED,
  EMAIL_AND_PASSWORD_LOGIN, EMAIL_AND_PASSWORD_REGISTER, FACEBOOK_LOGIN,
  GET_USER, GITHUB_LOGIN,
  GOOGLE_LOGIN, LOGOUT, LOGOUT_SUCCESS, NOT_AUTHENTICATED,
} from '../actions/auth.actions';



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

    case GET_USER:
    case EMAIL_AND_PASSWORD_REGISTER:
    case EMAIL_AND_PASSWORD_LOGIN:
    case GOOGLE_LOGIN:
    case FACEBOOK_LOGIN:
    case GITHUB_LOGIN:
    case LOGOUT:
      return { ...state, pending: true };

    case AUTHENTICATED:
      return { ...state, user: action.payload, pending: false };

    case NOT_AUTHENTICATED:
    case LOGOUT_SUCCESS:
      return { ...state, user: defaultUser, pending: false };

    case AUTH_FAIL:
      return { ...state, pending: false };
  }

  return state;
}


export const selectUser = (state: AuthState) => state.user;
