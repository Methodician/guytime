import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
export const FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
const fsFunc = functions.firestore;
const adminFs = admin.firestore();

export const onChatMessageCreated = fsFunc
  .document('chatMessages/{messageId}')
  .onCreate(async (snap, context) => {
    const { messageId } = <{ messageId: string }>context.params;
    const message = snap.data()!;
    const { chatGroupId, senderId } = message;
    return addUnreadMessageToGroupAndUsers(chatGroupId, senderId, messageId);
  });

const addUnreadMessageToGroupAndUsers = async (
  chatGroupId: string,
  senderId: string,
  messageId: string,
) => {
  const chatGroupRef = adminFs.collection('chatGroups').doc(chatGroupId);
  const existingGroupSnap = await chatGroupRef.get();
  const existingGroup = existingGroupSnap.data()!;
  const participantMap = existingGroup.participantIds;
  const participantIds = Object.keys(participantMap).filter(
    id => id !== senderId,
  );

  const unreadMessagesUpdate: KeyMapI<boolean> = {};
  const promises = [];
  for (let uid of participantIds) {
    const keyPath = `unreadMessagesByUser.${uid}.${messageId}` as string;
    unreadMessagesUpdate[keyPath] = true;
    promises.push(addUnreadMessageToUser(uid, messageId));
  }

  promises.push(chatGroupRef.update(unreadMessagesUpdate));

  return Promise.all(promises);
};

const addUnreadMessageToUser = (userId: string, messageId: string) =>
  adminFs
    .collection('users')
    .doc(userId)
    .collection('meta')
    .doc('unreadMessages')
    .set({ [messageId]: true }, { merge: true });

// MODELS
export interface KeyMapI<T> {
  [key: string]: T;
}
