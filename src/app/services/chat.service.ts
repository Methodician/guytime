import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { ChatGroupI } from '../models/chat-group';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private afs: AngularFirestore, private fbSvc: FirebaseService) {
    // ["da4RmsE4fUX3TjXvyUqzlxFW19a2", "P9X37J3EXQNz4b8WZPJWTIR81eN2"]

    this.pairedChatRef(
      'da4RmsE4fUX3TjXvyUqzlxFW19a2',
      'P9X37J3EXQNz4b8WZPJWTIR81eN2',
    )
      .valueChanges()
      .subscribe(console.log);
  }

  createChat = async (participants: string[]) => {
    if (participants.length === 2) {
      const existingChats = await this.getPairedChat(
        participants[0],
        participants[1],
      );
      console.log(existingChats); //chatId //
      // if existingChats has more than zero entries just return the id of the first one...
      // We This should tentatively prevent there from ever being more than 1 entries, and you can test this by clearing the database of chats later
    }
    const participantsMap = {};
    for (let id of participants) {
      participantsMap[id] = true;
    }
    const chatId = this.afs.createId();
    const chatGroup: ChatGroupI = {
      participantIds: participantsMap,
      createdAt: this.fbSvc.fsTimestamp(),
    };
    await this.afs.collection('chats').doc(chatId).set(chatGroup);
    return chatId;
  };

  getPairedChat = async (uid1: string, uid2: string) => {
    const chatsRef = this.pairedChatRef(uid1, uid2);
    const matchingChats = await chatsRef.get().toPromise();
    const chatGroups = matchingChats.docs.map(doc => {
      const data = doc.data();
      console.log(`${data}`);
      const { id } = doc;
      console.log(`${id}`);
      return { ...data, id };
    });
    console.log(`${chatGroups}`);
    return chatGroups;
  };

  chatGroupsRef = () => this.afs.collection<ChatGroupI>('chats');
  chatGroupRef = (chatGroupId: string) =>
    this.chatGroupsRef().doc<ChatGroupI>(chatGroupId);

  pairedChatRef = (uid1: string, uid2: string) => {
    const chatsRef = this.afs.collection<ChatGroupI>('chats', ref =>
      ref
        .where(`participantIds.${uid1}`, '==', true)
        .where(`participantIds.${uid2}`, '==', true),
    );
    return chatsRef;
  };
}

// ref.where('participantIds', 'array-contains', ['fUv', 'sLR']),
