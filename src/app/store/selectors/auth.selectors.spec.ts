import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { authReducer, AuthState, initialAuthState } from '../reducers/auth.reducer';
import { TestBed } from '@angular/core/testing';
import { appReducers } from '../reducers';
import { getAuthState } from './auth.selectors';
import { Authenticated } from '../actions/auth.actions';


const testUser = { authenticated: true, name: 'GUEST', email: 'mruk@tugush.com' };


describe('Auth Selectors', () => {
  let store: Store<AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...appReducers,
          auth: combineReducers(authReducer)
        })
      ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('getAuthState', () => {
    it('should return auth state', () => {
      let result: any = 99;

      store.select(getAuthState).subscribe(value => {
        result = value;
      });

      console.log('result - ', result);
      expect(result).toEqual({ ...initialAuthState });

      store.dispatch(new Authenticated(testUser));

      console.log('result - ', result);
      expect(result).toEqual({ ...initialAuthState, user: testUser });
    });
  });
});
