import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { ChatGroupI } from '../models/chat-group';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private afs: AngularFirestore, private fbSvc: FirebaseService) {}

  createChat = async (participants: string[]) => {
    const chatId = this.afs.createId();
    const chatGroup: ChatGroupI = {
      participantIds: participants,
      createdAt: this.fbSvc.fsTimestamp(),
    };
    await this.afs.collection('chats').doc(chatId).set(chatGroup);
    return chatId;
  };

  chatGroupsRef = () => this.afs.collection<ChatGroupI>('chats');
  chatGroupRef = (chatGroupId: string) =>
    this.chatGroupsRef().doc<ChatGroupI>(chatGroupId);
}
