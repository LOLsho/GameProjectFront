import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GameItem } from '../game-wrapper/game.interfaces';
import { map, take } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { firestore } from 'firebase';
import { Store } from '@ngrx/store';
import DocumentData = firebase.firestore.DocumentData;
import { User } from '../auth/auth.interface';
import * as firebase from 'firebase/app';
import { selectGameId } from '@store/game-info-store/selectors';
import { selectSessionId } from '@store/session-store/selectors';
import { selectAuthUserId } from '@store/auth-store/selectors';
import { AppState } from '@store/state';
import { Message } from '../chat/message/message.models';
import DocumentReference = firebase.firestore.DocumentReference;


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentGameId: string;
  currentSessionId: string;
  userId: string;

  constructor(
    private db: AngularFirestore,
    private store: Store<AppState>,
  ) {
    this.store.select(selectGameId).subscribe((gameId: string) => {
      this.currentGameId = gameId;
    });
    this.store.select(selectSessionId).subscribe((sessionId: string) => {
      this.currentSessionId = sessionId;
    });
    this.store.select(selectAuthUserId).subscribe((id: string) => {
      this.userId = id;
    });
  }

  getUser(uid: string) {
    return this.getUsersCollection().doc(uid)
      .get().pipe(
        map((res) => res.data()),
      );
  }

  addNewUser(user: any): Observable<any> {
    const newUser: Partial<User> = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    return fromPromise(this.db.collection<User>('users').doc(newUser.uid).set(newUser));
  }

  getSessionById(sessionId: string): Observable<any> {
    return this.getSessionDocument(sessionId).get();
  }

  getSessionList(query: Query): AngularFirestoreCollection<DocumentData> {
    return this.getGameDocument().collection('sessions', this.queryFn.bind(null, query));
  }

  getUsersCollection(): AngularFirestoreCollection {
    return this.db.collection<User>('users');
  }

  getUsers(query: Query): AngularFirestoreCollection {
    return this.db.collection<User>('users', this.queryFn.bind(null, query));
  }

  getGamesCollection(): AngularFirestoreCollection {
    return this.db.collection<GameItem>('games');
  }

  getGameDocument(): AngularFirestoreDocument {
    return this.getGamesCollection().doc<any>(this.currentGameId);
  }

  getSessionsCollection(): AngularFirestoreCollection {
    return this.getGameDocument().collection<any>('sessions');
  }

  getSessionDocument(id?: string): AngularFirestoreDocument {
    if (!id) id = this.currentSessionId;
    return this.getSessionsCollection().doc<any>(id);
  }

  getStepsCollection(sessionId: string, query?: Query): AngularFirestoreCollection {
    return this.getSessionDocument(sessionId).collection<any>('steps', this.queryFn.bind(null, query));
  }

  getGameIdByName(name: string): Observable<string> {
    return this.db.collection('games', ref => ref.where('name', '==', name))
      .snapshotChanges().pipe(
        map((res) => res[0].payload.doc.id),
        take(1)
      );
  }

  getGeneralMessagesCollection(query?: Query): AngularFirestoreCollection<DocumentData> {
    return this.db.collection<Message>('chat', this.queryFn.bind(null, query));
  }

  sendGeneralMessage(message: Message): Observable<DocumentReference> {
    return fromPromise(this.getGeneralMessagesCollection().add(message));
  }

  createNewGameSession(data): Observable<DocumentReference> {
    return fromPromise(this.getSessionsCollection().add(data));
  }

  updateGameSession(data, id?: string): Observable<any> {
    return fromPromise(this.getSessionDocument(id).update(data));
  }

  getGameListChanges(): Observable<any> {
    return this.getGamesCollection().snapshotChanges();
  }

  addGameStep(step: any, sessionId: string): Observable<any> {
    return fromPromise(this.getStepsCollection(sessionId).add(step));
  }

  getTimestampFromDate(date) {
    return firestore.Timestamp.fromDate(new Date(date));
  }

  getFirestoreTimestamp() {
    return firebase.firestore.Timestamp.now();
  }

  queryFn(query: Query, ref) {
    if (query && query.where) {
      query.where.forEach((whereQuery: Where) => {
        ref = ref.where(whereQuery.field, whereQuery.opStr, whereQuery.value);
      });
    }
    return ref;
  }
}


export interface Query {
  where?: Where[];
}

export interface Where {
  field: string;
  opStr: string;
  value: any;
}
