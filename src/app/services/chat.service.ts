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

    // separation of concerns. This function should do one thing only which is
    // Create chat group and return the chatId
    // The component that gets the chatId can route the user to the new location.
    // ok we can move some code to other-detail than
    //this.router.navigateByUrl(`/chat-detail/${chatId}`);
  };

  chatGroupsRef = () => this.afs.collection<ChatGroupI>('chats');
  chatGroupRef = (chatGroupId: string) =>
    this.chatGroupsRef().doc<ChatGroupI>(chatGroupId);
}
