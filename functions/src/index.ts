import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
export const FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const makeUppercase = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snap, context) => {
    const original = snap.data()!.original;
    console.log('Uppercasing', context.params.documentId, original);
    const uppercase = original.toUpperCase() + 'uppercased';
    return snap.ref.set({ uppercase }, { merge: true });
  });
