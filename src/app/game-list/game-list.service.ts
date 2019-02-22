import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GameItem, GameList } from '../game-wrapper/game.interfaces';


@Injectable()
export class GameListService {

  constructor(
    private db: AngularFirestore,
  ) { }

  getGameList(): Observable<GameList> {
    return this.db.collection<GameItem>('games').valueChanges();
  }
}
