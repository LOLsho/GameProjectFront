import { authReducer, initialAuthState, selectUser } from './auth.reducer';
import {
  Authenticated, AuthFail,
  EmailAndPasswordLogin,
  EmailAndPasswordRegister,
  FacebookLogin,
  GetUser, GithubLogin,
  GoogleLogin, Logout, NotAuthenticated,
} from '../actions/auth.actions';
import { AuthWithEmailAndPasswordData, defaultUser } from '../../auth/auth.interface';


const testUserCredentials: AuthWithEmailAndPasswordData = {
  email: 'mruk@tugush.com',
  password: '123123',
};
const testUser = { authenticated: true, name: 'GUEST', email: 'mruk@tugush.com' };


describe('AuthReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = authReducer(undefined, action);

      expect(state).toBe(initialAuthState);
    });
  });

  describe('GET_USER action', () => {
    it('should set pending to true', () => {
      const action = new GetUser();
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('EMAIL_AND_PASSWORD_REGISTER action', () => {
    it('should set pending to true', () => {
      const action = new EmailAndPasswordRegister(testUserCredentials);
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('EMAIL_AND_PASSWORD_LOGIN action', () => {
    it('should set pending to true', () => {
      const action = new EmailAndPasswordLogin(testUserCredentials);
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('GOOGLE_LOGIN action', () => {
    it('should set pending to true', () => {
      const action = new GoogleLogin();
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('FACEBOOK_LOGIN action', () => {
    it('should set pending to true', () => {
      const action = new FacebookLogin();
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('GITHUB_LOGIN action', () => {
    it('should set pending to true', () => {
      const action = new GithubLogin();
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('LOGOUT action', () => {
    it('should set pending to true', () => {
      const action = new Logout();
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(true);
      expect(state.user).toEqual(null);
    });
  });

  describe('AUTHENTICATED action', () => {
    it('should set pending to false and return authenticated user', () => {
      const action = new Authenticated(testUser);
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(false);
      expect(state.user).toEqual(testUser);
    });
  });

  describe('NOT_AUTHENTICATED action', () => {
    it('should set pending to false and return authenticated user', () => {
      const action = new NotAuthenticated();
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(false);
      expect(state.user).toEqual(defaultUser);
    });
  });

  describe('AUTH_FAIL action', () => {
    it('should set pending to false', () => {
      const action = new AuthFail({message: 'error'});
      const state = authReducer(initialAuthState, action);

      expect(state.pending).toEqual(false);
    });
  });
});

describe('AuthReducer Selectors', () => {
  describe('selectUser', () => {
    it('should return .user', () => {
      const state = { ...initialAuthState, user: testUser };
      const receivedUser = selectUser(state);

      expect(receivedUser).toEqual(testUser);
    });
  });
});
