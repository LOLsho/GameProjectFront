import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  AUTH_FAIL,
  Authenticated,
  AuthFail,
  EMAIL_AND_PASSWORD_LOGIN,
  EMAIL_AND_PASSWORD_REGISTER,
  EmailAndPasswordLogin, EmailAndPasswordRegister,
  FACEBOOK_LOGIN,
  GET_USER,
  GITHUB_LOGIN,
  GOOGLE_LOGIN,
  LOGOUT,
  LOGOUT_SUCCESS,
  LogoutSuccess,
  NotAuthenticated,
} from '../actions/auth.actions';
import { AuthWithEmailAndPasswordData, defaultUser, User } from '../../auth/auth.interface';
import { fromPromise } from 'rxjs/internal-compatibility';
import { auth } from 'firebase';
import { RouterGo } from '../actions/router.actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
  ) {}

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(GET_USER),
    switchMap(() => this.afAuth.authState),
    map((authData) => {
      if (authData) {
        const user: User = {
          email: authData.email,
          displayName: authData.displayName,
          uid: authData.uid,
          photoURL: authData.photoURL,
          authenticated: true,
        };
        return new Authenticated(user);
      } else {
        return new NotAuthenticated();
      }
    }),
  );

  @Effect()
  emailAndPasswordLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(EMAIL_AND_PASSWORD_LOGIN),
    map((action: EmailAndPasswordLogin) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return this.afAuth.auth.signInWithEmailAndPassword(payload.email, payload.password);
    }),
    mergeMap((credential) => [
      new Authenticated({ uid: credential.user.uid, authenticated: true }),
      new RouterGo({path: ['/games']})
    ])
  );

  @Effect()
  emailAndPasswordRegister$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(EMAIL_AND_PASSWORD_REGISTER),
    map((action: EmailAndPasswordRegister) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return this.afAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password);
    }),
    mergeMap((credential) => [
      new Authenticated({ uid: credential.user.uid, authenticated: true }),
      new RouterGo({path: ['/games']})
    ])
  );

  @Effect()
  googleLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(GOOGLE_LOGIN),
    switchMap(() => {
      const provider = new auth.GoogleAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider));
    }),
    mergeMap((credential) => [
      new Authenticated({ uid: credential.user.uid, authenticated: true }),
      new RouterGo({path: ['/games']})
    ]),
    catchError((error) => of(new AuthFail(error))),
  );

  @Effect()
  facebookLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(FACEBOOK_LOGIN),
    switchMap(() => {
      const provider = new auth.FacebookAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider));
    }),
    mergeMap((credential) => {
      return [
        new Authenticated({ uid: credential.user.uid, authenticated: true }),
        new RouterGo({path: ['/games']})
      ];
    }),
    catchError((error) => of(new AuthFail(error))),
  );

  @Effect()
  githubLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(GITHUB_LOGIN),
    switchMap(() => {
      const provider = new auth.GithubAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider));
    }),
    mergeMap((credential) => {
      return [
        new Authenticated({ uid: credential.user.uid, authenticated: true }),
        new RouterGo({path: ['/games']})
      ];
    }),
    catchError((error) => of(new AuthFail(error))),
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(LOGOUT),
    switchMap(() => of(this.afAuth.auth.signOut())),
    map((authData) => new LogoutSuccess(defaultUser)),
    catchError((error) => of(new AuthFail(error))),
  );

  @Effect()
  onLogout$: Observable<Action> = this.actions$.pipe(
    ofType(LOGOUT_SUCCESS),
    map(() => new RouterGo({
      path: ['authentication/sign-in']
    }))
  );

  @Effect({ dispatch: false })
  onAuthError$ = this.actions$.pipe(
    ofType(AUTH_FAIL),
    map((action: AuthFail) => action.payload),
    tap((error) => console.error(error.message))
  );
}
