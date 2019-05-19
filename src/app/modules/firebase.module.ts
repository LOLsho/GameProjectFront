import { NgModule } from '@angular/core';
import { firebaseConfig } from '../../assets/configs/firebase/firebase.config';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';


@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig, { timestampsInSnapshots: true }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
})
export class FirebaseModule { }
