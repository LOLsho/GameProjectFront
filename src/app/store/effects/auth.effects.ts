import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import {
  AuthActionTypes,
  Authenticated,
  AuthFail,
  EmailAndPasswordLogin, EmailAndPasswordRegister,
  LogoutSuccess, NewUserRegistered,
  NotAuthenticated, SetUser,
} from '../actions/auth.actions';
import { AuthWithEmailAndPasswordData, defaultUser, User } from '../../auth/auth.interface';
import { fromPromise } from 'rxjs/internal-compatibility';
import { auth } from 'firebase';
import { RouterGo } from '../actions/router.actions';
import { NotifierService } from 'angular-notifier';
import { ClearAppState } from '../actions/app.actions';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirestoreService } from '../../services/firestore.service';
import { TranslationService } from 'angular-l10n';
import { AppState } from '../reducers';
import { selectCurrentUrl } from '../selectors/router.selectors';
import { PresenceService } from '../../services/presence.service';


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
  ) {
    // console.log('this.fireDatabase -', this.fireDatabase);
    //
    // this.fireDatabase.object('')
    //
    // this.fireDatabase.database.ref('./info/connected').on('value', function (snapshot) {
    //   console.log('snapshot -', snapshot);
    //   console.log('snapshot.val() -', snapshot.val());
    //   if (snapshot.val() === false) return;
    // });
  }

  @Effect()
  getUser$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.GetUser),
    switchMap(() => this.afAuth.authState),
    map((user: any) => {
      if (user) {
        this.notifierService.notify(
          'default',
          this.translation.translate('You are signed in with email') + ` "${user.email}"`
        );
        return new Authenticated(user);
      } else {
        return new NotAuthenticated();
      }
    }),
  );

  @Effect()
  userAuthenticated$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.Authenticated),
    map((action: EmailAndPasswordRegister) => action.payload),
    switchMap((firebaseUser: Partial<User>) => this.firestoreService.getUser(firebaseUser.uid).pipe(
      withLatestFrom(this.store.select(selectCurrentUrl).pipe(filter((url) => !!url))),
      mergeMap(([user, url]: [User, string]) => {
        const actions: Action[] = [new SetUser({ ...user, authenticated: true })];

        if (url.includes('authentication'))  {
          actions.push(new RouterGo({path: ['/games']}));
        }

        return actions;
      }),
      catchError((error) => of(new AuthFail(error)))
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
    ofType(AuthActionTypes.EmailAndPasswordRegister),
    map((action: EmailAndPasswordRegister) => action.payload),
    switchMap((payload: AuthWithEmailAndPasswordData) => {
      return fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password)).pipe(
        mergeMap((credential: any) => [
          new NewUserRegistered(credential),
          new Authenticated({ uid: credential.user.uid, authenticated: true }),
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
        mergeMap((credential: any) => [
          new NewUserRegistered(credential),
          new Authenticated({ uid: credential.user.uid, authenticated: true }),
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
        mergeMap((credential: any) => {
          return [
            new NewUserRegistered(credential),
            new Authenticated({ uid: credential.user.uid, authenticated: true }),
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
        mergeMap((credential: any) => {
          return [
            new NewUserRegistered(credential),
            new Authenticated({ uid: credential.user.uid, authenticated: true }),
          ];
        }),
        catchError((error) => of(new AuthFail(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  newUserRegistered$: Observable<Action> | any = this.actions$.pipe(
    ofType(AuthActionTypes.NewUserRegistered),
    map((action: AuthFail) => action.payload),
    filter((credentials: any) => credentials.additionalUserInfo.isNewUser),
    map((credentials: any) => credentials.user),
    switchMap((user: any) => this.firestoreService.addNewUser(user)),
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    tap(() => this.presenceService.onSignOut()),
    switchMap(() => of(this.afAuth.auth.signOut()).pipe(
      map(() => {
        this.notifierService.notify('default', this.translation.translate('You have signed out'));
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
      console.log('Error in AUTH effects! Error:', error);
      if (error.message) this.notifierService.notify('error', error.message);
    })
  );
}

