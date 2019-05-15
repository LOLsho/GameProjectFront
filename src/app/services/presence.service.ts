import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { first, map, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { of } from 'rxjs';
import { FirestoreService } from './firestore.service';


export type UserStatus = 'online' | 'offline' | 'away';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(
    private afAuth: AngularFireAuth,
    private fireDatabase: AngularFireDatabase,
    private firestoreService: FirestoreService,
  ) {
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async setPresence(status: UserStatus) {
    const user = await this.getUser();

    if (user) {
      return this.fireDatabase.object(`status/${user.uid}`).update({
        status: status,
        statusChangeTimestamp: this.timestamp,
      });
    }
  }

  get timestamp() {
    return this.firestoreService.getFirestoreTimestamp();
    // return firebase.firestore.FieldValue.serverTimestamp();
  }

  updateOnUser() {
    const connection = this.fireDatabase.object('.info/connected').valueChanges().pipe(
      map((connected) => connected ? 'online' : 'offline'),
    );

    return this.afAuth.authState.pipe(
      switchMap((user) => user ? connection : of('offline')),
      tap((status: UserStatus) => this.setPresence(status)),
    );
  }

  updateOnAway() {
    document.onvisibilitychange = (e) => {
      if (document.visibilityState === 'hidden') {
        this.setPresence('away');
      } else {
        this.setPresence('online');
      }
    };
  }

  async onSignOut() {
    console.log('before this.setPresence(\'offline\');');
    await this.setPresence('offline');
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap((user) => {
        if (user) {
          this.fireDatabase.object(`status/${user.uid}`).query.ref.onDisconnect()
            .update({
              status: 'offline',
              statusChangeTimestamp: this.timestamp,
            });
        }
      }),
    );
  }
}
