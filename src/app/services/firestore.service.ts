import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GameItem } from '../game-wrapper/game.interfaces';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { firestore } from 'firebase';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { selectGameState } from '../game-wrapper/store/selectors/session.selectors';
import { GameState } from '../game-wrapper/store/reducers/session.reducer';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentGameId;
  currentSessionId;

  constructor(
    private db: AngularFirestore,
    private store: Store<AppState>,
  ) {
    this.store.select(selectGameState).subscribe((gameState: GameState) => {
      this.currentGameId = gameState.id;
      if (gameState.session) this.currentSessionId = gameState.session.id;
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

  getSessionDocument(): AngularFirestoreDocument {
    return this.getSessionsCollection().doc<any>(this.currentSessionId);
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

  getFirestoreTimestamp() {
    return firestore.Timestamp.fromDate(new Date());
  }
}
