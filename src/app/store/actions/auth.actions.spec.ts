import {
  AUTH_FAIL,
  AUTHENTICATED,
  Authenticated, AuthFail,
  EMAIL_AND_PASSWORD_LOGIN,
  EMAIL_AND_PASSWORD_REGISTER,
  EmailAndPasswordLogin,
  EmailAndPasswordRegister,
  FACEBOOK_LOGIN,
  FacebookLogin,
  GET_USER,
  GetUser,
  GITHUB_LOGIN,
  GithubLogin,
  GOOGLE_LOGIN,
  GoogleLogin,
  LOGOUT,
  Logout, LOGOUT_SUCCESS,
  LogoutSuccess,
  NOT_AUTHENTICATED,
  NotAuthenticated,
} from './auth.actions';
import { defaultUser } from '../../auth/auth.interface';



describe('Auth Actions', () => {

  describe('GetUser', () => {
    it('should create an action', () => {
      const action = new GetUser();

      expect({ ...action }).toEqual({
        type: GET_USER
      });
    });
  });

  describe('EmailAndPasswordLogin', () => {
    it('should create an action', () => {
      const payload = { email: 'mruk@tugush.com', password: '123123' };
      const action = new EmailAndPasswordLogin(payload);

      expect({ ...action }).toEqual({
        type: EMAIL_AND_PASSWORD_LOGIN,
        payload: payload,
      });
    });
  });

  describe('EmailAndPasswordRegister', () => {
    it('should create an action', () => {
      const payload = { email: 'mruk@tugush.com', password: '123123' };
      const action = new EmailAndPasswordRegister(payload);

      expect({ ...action }).toEqual({
        type: EMAIL_AND_PASSWORD_REGISTER,
        payload: payload,
      });
    });
  });

  describe('GoogleLogin', () => {
    it('should create an action', () => {
      const action = new GoogleLogin();

      expect({ ...action }).toEqual({
        type: GOOGLE_LOGIN,
      });
    });
  });

  describe('FacebookLogin', () => {
    it('should create an action', () => {
      const action = new FacebookLogin();

      expect({ ...action }).toEqual({
        type: FACEBOOK_LOGIN,
      });
    });
  });

  describe('GithubLogin', () => {
    it('should create an action', () => {
      const action = new GithubLogin();

      expect({ ...action }).toEqual({
        type: GITHUB_LOGIN,
      });
    });
  });

  describe('GithubLogin', () => {
    it('should create an action', () => {
      const action = new GithubLogin();

      expect({ ...action }).toEqual({
        type: GITHUB_LOGIN,
      });
    });
  });

  describe('Authenticated', () => {
    it('should create an action', () => {
      const action = new Authenticated(defaultUser);

      expect({ ...action }).toEqual({
        type: AUTHENTICATED,
        payload: defaultUser,
      });
    });
  });

  describe('NotAuthenticated', () => {
    it('should create an action', () => {
      const action = new NotAuthenticated();

      expect({ ...action }).toEqual({
        type: NOT_AUTHENTICATED,
      });
    });
  });

  describe('Logout', () => {
    it('should create an action', () => {
      const action = new Logout();

      expect({ ...action }).toEqual({
        type: LOGOUT,
      });
    });
  });

  describe('LogoutSuccess', () => {
    it('should create an action', () => {
      const action = new LogoutSuccess(defaultUser);

      expect({ ...action }).toEqual({
        type: LOGOUT_SUCCESS,
        payload: defaultUser,
      });
    });
  });

  describe('AuthFail', () => {
    it('should create an action', () => {
      const action = new AuthFail({ message: 'hello' });

      expect({ ...action }).toEqual({
        type: AUTH_FAIL,
        payload: { message: 'hello' },
      });
    });
  });

});
