import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GameItem, GameList } from '../game-wrapper/game.interfaces';
import { Update } from '@ngrx/entity';
import { fromPromise } from 'rxjs/internal-compatibility';


@Injectable()
export class GameListService {

  constructor(
    private db: AngularFirestore,
  ) { }

  getGameList(): Observable<any> {
    return this.db.collection<GameItem>('games').snapshotChanges();
  }

  getGameListDoc(id: string | number): AngularFirestoreDocument<GameItem> {
    return this.db.doc(`games/${id}`);
  }
}
