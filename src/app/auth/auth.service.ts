import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthWithEmailAndPasswordData, User } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user: User;
  user$: Observable<any> = this.afAuth.authState.pipe(
    switchMap(user => {
      console.log('user - ', user);

      this.user = user;

      if (user) {
        return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    })
  );

  // isLoggedIn$ = new BehaviorSubject<boolean>(!!this.token);
  isLoggedIn$ = this.afAuth.authState.pipe(
    map(user => {
      return !!user;
    })
  );

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router,
  ) {
    this.user$.subscribe();
    // this.afAuth.authState.subscribe(state => console.log('state - ', state));
  }

  loginViaGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(
      credential => {
        return this.updateUserData(credential.user);
      },
      error => {

      }
    );

  }

  async loginViaFacebook() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  updateUserData({ uid, email, displayName, photoURL }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(`users/${uid}`);

    console.log('userRef - ', userRef);


    const data = { uid, email, displayName, photoURL };

    console.log('data - ', data);

    return userRef.set(data, { merge: true });
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  registerViaEmailAndPassword({email, password}: AuthWithEmailAndPasswordData) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginViaEmailAndPassword({email, password}: AuthWithEmailAndPasswordData) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    // this.store.clearStore();
    return this.afAuth.auth.signOut();
  }
}
