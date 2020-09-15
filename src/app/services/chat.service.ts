import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { ChatGroupI } from '../models/chat-group';
import { MessageI } from '../models/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  testMessages$: BehaviorSubject<MessageI[]> = new BehaviorSubject([]);

  constructor(private afs: AngularFirestore, private fbSvc: FirebaseService) {}

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
    const chatId = this.afs.createId();
    const chatGroup: ChatGroupI = {
      participantIds: participantsMap,
      createdAt: this.fbSvc.fsTimestamp(),
    };
    await this.pairChatDoc(chatId).set(chatGroup);
    return chatId;
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

  chatGroupsCol = () => this.afs.collection<ChatGroupI>('chats');
  chatGroupDoc = (chatGroupId: string) =>
    this.chatGroupsCol().doc<ChatGroupI>(chatGroupId);

  pairChatsCol = () => this.afs.collection<ChatGroupI>('pairChatGroups');
  pairChatDoc = (chatGroupId: string) =>
    this.pairChatsCol().doc<ChatGroupI>(chatGroupId);

  pairChatColQuery = (uid1: string, uid2: string) => {
    const chatsRef = this.afs.collection<ChatGroupI>('pairChatGroups', ref =>
      ref
        .where(`participantIds.${uid1}`, '==', true)
        .where(`participantIds.${uid2}`, '==', true),
    );
    return chatsRef;
  };

  sendMessage = (message: MessageI) => {
    this.testMessages$.next(this.testMessages$.getValue().concat([message]));
  };
}
