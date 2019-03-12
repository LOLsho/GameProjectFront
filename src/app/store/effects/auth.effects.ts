import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  AuthActionTypes,
  Authenticated,
  AuthFail,
  EmailAndPasswordLogin, EmailAndPasswordRegister,
  LogoutSuccess,
  NotAuthenticated,
} from '../actions/auth.actions';
import { AuthWithEmailAndPasswordData, defaultUser, User } from '../../auth/auth.interface';
import { fromPromise } from 'rxjs/internal-compatibility';
import { auth } from 'firebase';
import { RouterGo } from '../actions/router.actions';
import { NotifierService } from 'angular-notifier';
import { ClearAppState } from '../actions/app.actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private notifierService: NotifierService,
  ) {}

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.GetUser),
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
        this.notifierService.notify('default', `You are signed in with email "${user.email}"`);
        return new Authenticated(user);
      } else {
        return new NotAuthenticated();
      }
    }),
  );

  @Effect()
  emailAndPasswordRegister$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(AuthActionTypes.EmailAndPasswordRegister),
    map((action: EmailAndPasswordRegister) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password)).pipe(
        mergeMap((credential) => [
          new Authenticated({ uid: credential.user.uid, authenticated: true }),
          new RouterGo({path: ['/games']})
        ]),
        catchError((error) => of(new AuthFail(error)))
      );
    }),
  );

  @Effect()
  emailAndPasswordLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(AuthActionTypes.EmailAndPasswordLogin),
    map((action: EmailAndPasswordLogin) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return fromPromise(this.afAuth.auth.signInWithEmailAndPassword(payload.email, payload.password)).pipe(
        mergeMap((credential) => [
          new Authenticated({ uid: credential.user.uid, authenticated: true }),
          new RouterGo({path: ['/games']})
        ]),
        catchError((error) => of(new AuthFail(error)))
      );
    }),
  );

  @Effect()
  googleLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(AuthActionTypes.GoogleLogin),
    switchMap(() => {
      const provider = new auth.GoogleAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider)).pipe(
        mergeMap((credential) => [
          new Authenticated({ uid: credential.user.uid, authenticated: true }),
          new RouterGo({path: ['/games']})
        ]),
        catchError((error) => of(new AuthFail(error)))
      );
    }),
  );

  @Effect()
  facebookLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(AuthActionTypes.FacebookLogin),
    switchMap(() => {
      const provider = new auth.FacebookAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider)).pipe(
        mergeMap((credential) => {
          return [
            new Authenticated({ uid: credential.user.uid, authenticated: true }),
            new RouterGo({path: ['/games']})
          ];
        }),
        catchError((error) => of(new AuthFail(error))),
      );
    }),
  );

  @Effect()
  githubLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(AuthActionTypes.GithubLogin),
    switchMap(() => {
      const provider = new auth.GithubAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider)).pipe(
        mergeMap((credential) => {
          return [
            new Authenticated({ uid: credential.user.uid, authenticated: true }),
            new RouterGo({path: ['/games']})
          ];
        }),
        catchError((error) => of(new AuthFail(error))),
      );
    }),
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    switchMap(() => of(this.afAuth.auth.signOut()).pipe(
      map(() => {
        this.notifierService.notify('default', 'You have signed out');
        return new LogoutSuccess(defaultUser);
      }),
      catchError((error) => of(new AuthFail(error))),
    )),
  );

  @Effect()
  onLogout$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.LogoutSuccess),
    mergeMap(() => [
      new RouterGo({ path: ['authentication/sign-in'] }),
      new ClearAppState()
    ]),
  );

  @Effect({ dispatch: false })
  onAuthError$ = this.actions$.pipe(
    ofType(AuthActionTypes.AuthFail),
    map((action: AuthFail) => action.payload),
    tap((error: any) => {
      if (error.massage) this.notifierService.notify('error', error.message);
    })
  );

  // @Effect({ dispatch: false })
  // online$ = merge(
  //   of(navigator.onLine),
  //   fromEvent(window, 'online').pipe(mapTo(true)),
  //   fromEvent(window, 'offline').pipe(mapTo(false)),
  // ).pipe(map(online => console.log(online)));
}
