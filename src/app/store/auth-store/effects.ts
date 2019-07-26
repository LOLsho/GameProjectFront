import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { NotifierService } from 'angular-notifier';
import { FirestoreService } from '../../services/firestore.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { TranslationService } from 'angular-l10n';
import { Action, Store } from '@ngrx/store';
import * as authActions from './actions';
import { PresenceService } from '../../services/presence.service';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { AuthWithEmailAndPasswordData, defaultUser, User } from '../../auth/auth.interface';
import { fromPromise } from 'rxjs/internal-compatibility';
import { AppState } from '@store/state';
import { selectRouterUrl } from '@store/router-store/selectors';
import { RouterGo } from '@store/router-store/actions';
import { ClearAppState } from '@store/actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private notifierService: NotifierService,
    private firestoreService: FirestoreService,
    private fireDatabase: AngularFireDatabase,
    private translation: TranslationService,
    private store: Store<AppState>,
    private presenceService: PresenceService,
  ) {}

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.ActionTypes.GetUser),
    tap(() => console.log('tap in getUser$')),
    switchMap(() => this.afAuth.authState.pipe(take(1))),
    map((user: any) => {
      if (user) {
        this.notifierService.notify(
          'default',
          this.translation.translate('You are signed in with email') + ` "${user.email}"`
        );
        return new authActions.Authenticated(user);
      } else {
        return new authActions.NotAuthenticated();
      }
    }),
  );

  @Effect()
  userAuthenticated$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.ActionTypes.Authenticated),
    map((action: authActions.EmailAndPasswordRegister) => action.payload),
    switchMap((firebaseUser: Partial<User>) => this.firestoreService.getUser(firebaseUser.uid).pipe(
      withLatestFrom(this.store.select(selectRouterUrl)),
      mergeMap(([user, url]: [User, string]) => {
        const actions: Action[] = [new authActions.SetUser({ ...user, authenticated: true })];

        if (url.includes('authentication'))  {
          actions.push(new RouterGo({ path: ['/games'] }));
        }

        return actions;
      }),
      catchError((error) => of(new authActions.AuthFail(error))),
    )),
  );

  // @Effect({ dispatch: false })
  // updateCurrentUser$: Observable<Action> = this.actions$.pipe(
  //   ofType(AuthActionTypes.UpdateCurrentUser),
  //   map((action: UpdateCurrentUser) => action.payload),
  //   switchMap((updateData: Partial<User>) => {
  //     return fromPromise(this.afAuth.auth.currentUser.updateProfile({ displayName: updateData.nickname })).pipe(
  //       tap(console.log)
  //     );
  //   })
  // );

  @Effect()
  emailAndPasswordRegister$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.ActionTypes.EmailAndPasswordRegister),
    map((action: authActions.EmailAndPasswordRegister) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password)).pipe(
        mergeMap((credential: any) => [
          new authActions.NewUserRegistered(credential),
          new authActions.Authenticated({ uid: credential.user.uid, authenticated: true }),
        ]),
        catchError((error) => of(new authActions.AuthFail(error))),
      );
    }),
  );

  @Effect()
  emailAndPasswordLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(authActions.ActionTypes.EmailAndPasswordLogin),
    map((action: authActions.EmailAndPasswordLogin) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return fromPromise(this.afAuth.auth.signInWithEmailAndPassword(payload.email, payload.password)).pipe(
        mergeMap((credential) => [
          new authActions.Authenticated({ uid: credential.user.uid, authenticated: true }),
        ]),
        catchError((error) => of(new authActions.AuthFail(error))),
      );
    }),
  );

  @Effect()
  googleLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(authActions.ActionTypes.GoogleLogin),
    switchMap(() => {
      const provider = new auth.GoogleAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider)).pipe(
        mergeMap((credential: any) => [
          new authActions.NewUserRegistered(credential),
          new authActions.Authenticated({ uid: credential.user.uid, authenticated: true }),
        ]),
        catchError((error) => of(new authActions.AuthFail(error))),
      );
    }),
  );

  @Effect()
  facebookLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(authActions.ActionTypes.FacebookLogin),
    switchMap(() => {
      const provider = new auth.FacebookAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider)).pipe(
        mergeMap((credential: any) => {
          return [
            new authActions.NewUserRegistered(credential),
            new authActions.Authenticated({ uid: credential.user.uid, authenticated: true }),
          ];
        }),
        catchError((error) => of(new authActions.AuthFail(error))),
      );
    }),
  );

  @Effect()
  githubLogin$: Observable<Action | Action[]> = this.actions$.pipe(
    ofType(authActions.ActionTypes.GithubLogin),
    switchMap(() => {
      const provider = new auth.GithubAuthProvider();
      return fromPromise(this.afAuth.auth.signInWithPopup(provider)).pipe(
        mergeMap((credential: any) => {
          return [
            new authActions.NewUserRegistered(credential),
            new authActions.Authenticated({ uid: credential.user.uid, authenticated: true }),
          ];
        }),
        catchError((error) => of(new authActions.AuthFail(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  newUserRegistered$: Observable<Action> | any = this.actions$.pipe(
    ofType(authActions.ActionTypes.NewUserRegistered),
    map((action: authActions.AuthFail) => action.payload),
    filter((credentials: any) => credentials.additionalUserInfo.isNewUser),
    map((credentials: any) => credentials.user),
    switchMap((user: any) => this.firestoreService.addNewUser(user)),
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.ActionTypes.Logout),
    tap(() => this.presenceService.onSignOut()),
    switchMap(() => of(this.afAuth.auth.signOut()).pipe(
      map(() => {
        this.notifierService.notify('default', this.translation.translate('You have signed out'));
        return new authActions.LogoutSuccess(defaultUser);
      }),
      catchError((error) => of(new authActions.AuthFail(error))),
    )),
  );

  @Effect()
  onLogout$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.ActionTypes.LogoutSuccess),
    mergeMap(() => [
      new RouterGo({ path: ['authentication/sign-in'] }),
      new ClearAppState(),
    ]),
  );

  @Effect({ dispatch: false })
  onAuthError$ = this.actions$.pipe(
    ofType(authActions.ActionTypes.AuthFail),
    map((action: authActions.AuthFail) => action.payload),
    tap((error: any) => {
      console.log('Error in AUTH effects! Error:', error);
      if (error.message) this.notifierService.notify('error', error.message);
    })
  );
}

