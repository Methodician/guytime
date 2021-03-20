import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const FIRESTORE_EMULATOR_HOST = 'localhost:8080';

export { onFileUpload } from './storage.functions';

export { onUserCreated } from './auth.functions';

const fsFunc = functions.firestore;
const adminFs = admin.firestore();

export const onChatMessageCreated = fsFunc
  .document('chatMessages/{messageId}')
  .onCreate(async (snap, context) => {
    const { messageId } = <{ messageId: string }>context.params;
    const message = snap.data();
    const { chatGroupId, senderId, content } = message;
    const chatGroupRef = adminFs.collection('chatGroups').doc(chatGroupId);

    const addUnreadMessageToGroupAndUsersPromises = async () => {
      const existingGroupSnap = await chatGroupRef.get();
      const existingGroup = existingGroupSnap.data()!;
      const { participantsMap } = existingGroup;
      const participantIds = Object.keys(participantsMap).filter(
        id => id !== senderId,
      );

      const unreadMessagesUpdate: KeyMapI<boolean> = {};
      const promises = [];
      for (const uid of participantIds) {
        const addUnreadMessageToUser = () =>
          adminFs
            .collection('users')
            .doc(uid)
            .collection('meta')
            .doc('unreadMessages')
            .set({ [messageId]: true }, { merge: true });

        const keyPath = `unreadMessagesByUser.${uid}.${messageId}`;
        unreadMessagesUpdate[keyPath] = true;
        promises.push(addUnreadMessageToUser());
      }

      promises.push(chatGroupRef.update(unreadMessagesUpdate));

      return promises;
    };

    const addLatestMessageToGroup = async () => {
      const senderRef = adminFs.collection('users').doc(senderId);
      const senderSnap = await senderRef.get();
      const sender = senderSnap.data()!;

      const { fName, lName } = sender;
      const latestMessage = {
        fName,
        lName,
        content,
      };

      return chatGroupRef.update({ latestMessage });
    };

    const writePromises = await addUnreadMessageToGroupAndUsersPromises();
    writePromises.push(addLatestMessageToGroup());

    return Promise.all(writePromises);
  });

export const onChatMessageUpdated = fsFunc
  .document('chatMessages/{messageId}')
  .onUpdate(async (snap, context) => {
    const { messageId } = <{ messageId: string }>context.params;
    const prevMessage = snap.before.data();
    const newMessage = snap.after.data();
    const { chatGroupId } = prevMessage;

    const updateSeenbyTracking = () => {
      const findUserWhoJustSawMsg = () => {
        const newKeys = Object.keys(newMessage.seenBy);

        for (const key of newKeys) {
          if (!prevMessage.seenBy[key]) return key;
        }
        return null;
      };

      const userWhoJustSawItId = findUserWhoJustSawMsg();

      if (!!userWhoJustSawItId) {
        const userUpdate = adminFs
          .collection('users')
          .doc(userWhoJustSawItId)
          .collection('meta')
          .doc('unreadMessages')
          .update({ [messageId]: admin.firestore.FieldValue.delete() });

        const unreadMessagesUpdate: KeyMapI<any> = {};
        const keyPath = `unreadMessagesByUser.${userWhoJustSawItId}.${messageId}`;
        unreadMessagesUpdate[keyPath] = admin.firestore.FieldValue.delete();
        const groupUpdate = adminFs
          .collection('chatGroups')
          .doc(chatGroupId)
          .update(unreadMessagesUpdate);
        return Promise.all([userUpdate, groupUpdate]);
      }
      return;
    };

    if (!isKeyMapEqual(prevMessage.seenBy, newMessage.seenBy)) {
      return updateSeenbyTracking();
    }

    return;
  });

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

// MODELS
export interface KeyMapI<T> {
  [key: string]: T;
}
