import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { ChatGroupI } from '../models/chat-group';
import { ChatMessageI } from '../models/message';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private afs: AngularFirestore, private fbSvc: FirebaseService) {}

  setMessageAsSeenBy = async (uid: string, messageId: string) => {
    const messageDocRef = this.chatMessageDoc(messageId);
    const messageDocUpdate = { seenBy: { [uid]: true } };
    return messageDocRef.update(messageDocUpdate);
  };

  createChatMessage = async (message: ChatMessageI) => {
    const messageDocRef = await this.chatMessagesCol().add(message);
    const { id } = messageDocRef;
    return id;
  };

  createPairChat = async (uid1: string, uid2: string) => {
    const existingChats = await this.getPairChat(uid1, uid2);
    if (existingChats.length > 0) {
      const existingChat = existingChats[0];
      const { id } = existingChat;
      return id;
    }
    const participantsMap = {
      [uid1]: true,
      [uid2]: true,
    };
    const chatGroup: ChatGroupI = {
      participantsMap,
      unreadMessagesByUser: {},
      createdAt: this.fbSvc.fsTimestamp(),
      isPairChat: true,
    };
    const { id } = await this.chatGroupsCol().add(chatGroup);
    return id;
  };

  getPairChat = async (uid1: string, uid2: string): Promise<ChatGroupI[]> => {
    const chatsRef = this.pairChatColQuery(uid1, uid2);
    const matchingChats = await chatsRef.get().toPromise();
    const chatGroups = matchingChats.docs.map(doc => {
      const data = doc.data();
      const { id } = doc;
      const chatGroup = { ...data, id } as ChatGroupI;
      return chatGroup;
    });
    return chatGroups;
  };

  createGroupChat = async (uids: string[]) => {
    if (!uids || uids.length < 3)
      throw new Error(
        'You can only create group chats with an array of 3 or more userIds. To create a pair chat, call createPairChat.',
      );
    const participantsMap = uids.reduce((obj, item) => {
      return { ...obj, [item]: true };
    }, {});

    const chatGroup: ChatGroupI = {
      participantsMap,
      unreadMessagesByUser: {},
      createdAt: this.fbSvc.fsTimestamp(),
      isPairChat: false,
    };
    const { id } = await this.chatGroupsCol().add(chatGroup);
    return id;
  };

  watchChatsByUser$ = (uid: string) => {
    const chatsCol = this.chatGroupsByUserQuery(uid);
    return chatsCol.snapshotChanges().pipe(
      map(changeActions => {
        return changeActions.map(action => {
          const { doc } = action.payload;
          const { id } = doc;
          const data = doc.data();
          return { id, ...data };
        });
      }),
    );
  };

  chatGroupsCol = () => this.afs.collection<ChatGroupI>('chatGroups');
  chatGroupDoc = (chatGroupId: string) =>
    this.chatGroupsCol().doc<ChatGroupI>(chatGroupId);

  pairChatColQuery = (uid1: string, uid2: string) => {
    const chatsCol = this.afs.collection<ChatGroupI>('chatGroups', ref =>
      ref
        .where(`participantsMap.${uid1}`, '==', true)
        .where(`participantsMap.${uid2}`, '==', true)
        .where('isPairChat', '==', true),
    );
    return chatsCol;
  };

  chatGroupsByUserQuery = (uid: string) => {
    const chatsCol = this.afs.collection<ChatGroupI>('chatGroups', ref =>
      ref.where(`participantsMap.${uid}`, '==', true),
    );
    return chatsCol;
  };

  chatMessagesCol = () => this.afs.collection<ChatMessageI>('chatMessages');
  chatMessageDoc = (messageId: string) => this.chatMessagesCol().doc(messageId);

  chatMessagesByGroupQuery = (chatGroupId: string) =>
    this.afs.collection<ChatMessageI>('chatMessages', ref =>
      ref.where('chatGroupId', '==', chatGroupId).orderBy('createdAt', 'asc'),
    );

  chatMessagesBySenderQuery = (senderId: string) =>
    this.afs.collection<ChatMessageI>('chatMessages', ref =>
      ref.where('senderId', '==', senderId),
    );
}
