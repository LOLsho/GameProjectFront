import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable()
export class PlayersEffects {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
  ) {}

  // @Effe
}
