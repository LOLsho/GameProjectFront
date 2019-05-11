import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GameItem } from '../game-wrapper/game.interfaces';
import { map, take } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { firestore } from 'firebase';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { selectGameId } from '../game-wrapper/store/selectors/game-info.selectors';
import { selectSessionId } from '../game-wrapper/store/selectors/session.selectors';
import { selectUserId } from '../store/selectors/auth.selectors';
import DocumentData = firebase.firestore.DocumentData;


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
    this.store.select(selectUserId).subscribe((id: string) => {
      this.userId = id;
    });
  }

  getSessionById(sessionId: string): Observable<any> {
    return this.getSessionDocument(sessionId).get();
  }

  getSessionList(query: Query): AngularFirestoreCollection<DocumentData> {
    return this.getGameDocument().collection('sessions', (ref: any) => {
      if (query.where) {
        query.where.forEach((whereQuery: Where) => {
          ref = ref.where(whereQuery.field, whereQuery.opStr, whereQuery.value);
        });
      }
      return ref;
    });
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
    if (!id) id = this.currentSessionId; // TODO remove currentSessionId
    return this.getSessionsCollection().doc<any>(id);
  }

  getStepsCollection(sessionId: string, query?: Query): AngularFirestoreCollection {
    return this.getSessionDocument(sessionId).collection<any>('steps', (ref: any) => {
      if (query && query.where) {
        query.where.forEach((whereQuery: Where) => {
          ref = ref.where(whereQuery.field, whereQuery.opStr, whereQuery.value);
        });
      }
      return ref;
    });
  }

  getGameIdByName(name: string): Observable<string> {
    return this.db.collection('games', ref => ref.where('name', '==', name))
      .snapshotChanges().pipe(
        map((res) => res[0].payload.doc.id),
        take(1)
      );
  }

  createNewGameSession(data): Observable<any> {
    return fromPromise(this.getSessionsCollection().add(data));
  }

  updateGameSession(data): Observable<any> {
    return fromPromise(this.getSessionDocument().update(data));
  }

  getGameListChanges(): Observable<any> {
    return this.getGamesCollection().snapshotChanges();
  }

  addGameStep(step: any, sessionId: string): Observable<any> {
    return fromPromise(this.getStepsCollection(sessionId).add(step));
  }

  getFirestoreTimestamp() {
    return firestore.Timestamp.fromDate(new Date());
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
