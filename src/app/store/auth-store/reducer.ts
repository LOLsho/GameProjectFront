import { Actions, ActionTypes } from './actions';
import { initialState, AuthState } from './state';
import { defaultUser } from '../../auth/auth.interface';


export function authReducer(state: AuthState = initialState, action: Actions): AuthState {
  switch (action.type) {

    case ActionTypes.GetUser:
    case ActionTypes.EmailAndPasswordRegister:
    case ActionTypes.EmailAndPasswordLogin:
    case ActionTypes.GoogleLogin:
    case ActionTypes.FacebookLogin:
    case ActionTypes.GithubLogin:
    case ActionTypes.Logout:
    case ActionTypes.Authenticated:
      return { ...state, pending: true };

    case ActionTypes.SetUser:
      return { ...state, user: action.payload, pending: false };

    case ActionTypes.NotAuthenticated:
    case ActionTypes.LogoutSuccess:
      return { ...state, user: defaultUser, pending: false };

    case ActionTypes.AuthFail:
    case ActionTypes.NewUserRegistered:
      return { ...state, pending: false };
  }

  return state;
}
