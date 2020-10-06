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
    console.log('MESSAGE CREATED');
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
  const { participantsMap } = existingGroup;
  const participantIds = Object.keys(participantsMap).filter(
    id => id !== senderId,
  );

  const unreadMessagesUpdate: KeyMapI<boolean> = {};
  const promises = [];
  for (const uid of participantIds) {
    const keyPath = `unreadMessagesByUser.${uid}.${messageId}`;
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

export const onChatMessageUpdated = fsFunc
  .document('chatMessages/{messageId}')
  .onUpdate(async (snap, context) => {
    console.log('MESSAGE UPDATED');
    const { messageId } = <{ messageId: string }>context.params;
    const prevMessage = snap.before.data()!;
    const newMessage = snap.after.data()!;
    const { chatGroupId } = prevMessage;
    if (!isKeyMapEqual(prevMessage.seenBy, newMessage.seenBy)) {
      return updateSeenbyTracking(
        prevMessage.seenBy,
        newMessage.seenBy,
        messageId,
        chatGroupId,
      );
    }

    return;
  });

const updateSeenbyTracking = (
  prevSeenBy: KeyMapI<boolean>,
  newSeenBy: KeyMapI<boolean>,
  msgId: string,
  chatGroupId: string,
) => {
  const userWhoJustSawItId = findUserWhoJustSawMsg(prevSeenBy, newSeenBy);

  if (!!userWhoJustSawItId) {
    const userUpdate = adminFs
      .collection('users')
      .doc(userWhoJustSawItId)
      .collection('meta')
      .doc('unreadMessages')
      .update({ [msgId]: admin.firestore.FieldValue.delete() });

    const unreadMessagesUpdate: KeyMapI<any> = {};
    const keyPath = `unreadMessagesByUser.${userWhoJustSawItId}.${msgId}`;
    unreadMessagesUpdate[keyPath] = admin.firestore.FieldValue.delete();
    const groupUpdate = adminFs
      .collection('chatGroups')
      .doc(chatGroupId)
      .update(unreadMessagesUpdate);
    return Promise.all([userUpdate, groupUpdate]);
  }
  return;
};

// HELPERS
const isKeyMapEqual = (map1: any, map2: any) => {
  if ((map1 && !map2) || (map2 && !map1)) return false;

  const keys1 = Object.keys(map1);
  const keys2 = Object.keys(map2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = map1[key];
    const val2 = map2[key];

    if (val1 && val2 && val1 !== val2) return false;
  }

  return true;
};

const findUserWhoJustSawMsg = (prevSeenby: any, newSeenby: any) => {
  const newKeys = Object.keys(newSeenby);

  for (const key of newKeys) {
    if (!prevSeenby[key]) return key;
  }
  return null;
};

// MODELS
export interface KeyMapI<T> {
  [key: string]: T;
}
