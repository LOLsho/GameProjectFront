import { DataSnapshot } from 'firebase-functions/lib/providers/database';
import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { UserRecord } from 'firebase-functions/lib/providers/auth';


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const database = admin.database();


export const onUserCreated = functions.auth.user()
  .onCreate((user: UserRecord, context: EventContext) => {
    const usersCollectionRef = firestore.collection('users');
    return usersCollectionRef.add(user);
  });


export const onUserDeleted = functions.auth.user()
  .onDelete((user: UserRecord, context: EventContext) => {

    const userDatabaseRef = database.ref(`/status/${user.uid}`);
    userDatabaseRef.remove();

    const userFirestoreRef = firestore.doc(`users/${user.uid}`);
    return userFirestoreRef.delete();
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


export const updateActiveSessionOnCreate = functions.firestore
  .document('games/{gameId}/sessions/{sessionId}')
  .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {

    const session = snapshot.data();
    if (!session || session.gameMode === 'single') return null;

    const userRef = firestore.doc(`users/${session.playerIds[0]}`);
    const userDataSnap = await userRef.get();
    const userData = await userDataSnap.data();

    const activeSessions = userData.activeSessions || [];
    activeSessions.push(context.params.sessionId);

    return userRef.update({ activeSessions });
  });


export const updateActiveSessionOnDelete = functions.firestore
  .document('games/{gameId}/sessions/{sessionId}')
  .onDelete(async (snapshot: DocumentSnapshot, context: EventContext) => {
    const session = snapshot.data();

    if (!session) return;

    for (const id of session.playerIds) {
      const userRef = firestore.doc(`users/${id}`);
      const userDataSnap = await userRef.get();
      const userData = await userDataSnap.data();
      const activeSessions = userData.activeSessions;

      const index = activeSessions.findIndex((item: string) => item === context.params.sessionId);
      activeSessions.splice(index, 1);

      userRef.update({ activeSessions });
    }
  });


export const updateActiveSessionOnUpdate = functions.firestore
  .document('games/{gameId}/sessions/{sessionId}')
  .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
    const oldSession = change.before.data();
    const newSession = change.after.data();

    if (!oldSession || !newSession) return null;

    const sessionOver = !oldSession.isSessionOver && newSession.isSessionOver;

    let isTheSame = oldSession.playerIds.length === newSession.playerIds.length;

    if (isTheSame) {
      const uniqueElems = Array.from(new Set([...newSession.playerIds, ...oldSession.playerIds]));

      isTheSame = uniqueElems.length === oldSession.playerIds.length;
      if (sessionOver) isTheSame = false;
    }

    if (isTheSame) return null;

    if (sessionOver) {
      for (const id of newSession.playerIds) {
        const userRef = firestore.doc(`users/${id}`);
        const userDataSnap = await userRef.get();
        const userData = await userDataSnap.data();
        const activeSessions = userData.activeSessions;

        const index = activeSessions.findIndex((item: string) => item === context.params.sessionId);
        if (index !== -1) {
          activeSessions.splice(index, 1);
        }

        userRef.update({ activeSessions });
      }
    } else {
      const playersAdded = newSession.playerIds.filter((id: string) => {
        return !oldSession.playerIds.includes(id);
      });
      const playersDeleted = oldSession.playerIds.filter((id: string) => {
        return !newSession.playerIds.includes(id);
      });

      for (const id of playersAdded) {
        const userRef = firestore.doc(`users/${id}`);
        const userDataSnap = await userRef.get();
        const userData = await userDataSnap.data();
        const activeSessions = userData.activeSessions || [];

        activeSessions.push(context.params.sessionId);

        userRef.update({ activeSessions });
      }

      for (const id of playersDeleted) {
        const userRef = firestore.doc(`users/${id}`);
        const userDataSnap = await userRef.get();
        const userData = await userDataSnap.data();
        const activeSessions = userData.activeSessions;

        const index = activeSessions.findIndex((item: string) => item === context.params.sessionId);
        activeSessions.splice(index, 1);

        userRef.update({ activeSessions });
      }
    }

    return null;
  });
