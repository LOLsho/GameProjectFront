import { DataSnapshot } from 'firebase-functions/lib/providers/database';
import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { UserRecord } from 'firebase-functions/lib/providers/auth';


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();


export const onUserCreated = functions.auth.user()
  .onCreate((user: UserRecord, context: EventContext) => {
    const usersCollectionRef = firestore.collection('users');
    return usersCollectionRef.add(user);
  });


export const onUserStatusChanged = functions.database
  .ref('/status/{userUid}')
  .onUpdate(async (change: Change<DataSnapshot>, context: EventContext) => {
    const eventStatus = change.after.val();

    const userFirestoreRef = firestore.doc(`users/${context.params.userUid}`);

    const statusSnapshot = await change.after.ref.once('value');
    const status = statusSnapshot.val();

    if (status.timestamp > eventStatus.timestamp) {
      return null;
    }

    return userFirestoreRef.update(eventStatus);
  });


export const writeStepTimestamp = functions.firestore
  .document('games/{gameId}/sessions/{sessionId}/steps/{stepId}')
  .onCreate((snapshot: DocumentSnapshot, context: EventContext) => {
    const data: any = snapshot.data();
    data.timestamp = admin.firestore.FieldValue.serverTimestamp();
    return snapshot.ref.set(data);
  });
