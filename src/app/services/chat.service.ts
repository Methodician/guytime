import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { ChatGroupI } from '../models/chat-group';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private fbSvc: FirebaseService,
    private router: Router,
  ) {}

  createChat = async (participants: string[]) => {
    const chatId = this.afs.createId();
    const chatGroup: ChatGroupI = {
      participantIds: participants,
      createdAt: this.fbSvc.fsTimestamp(),
    };

    await this.afs.collection('chats').doc(chatId).set(chatGroup);
    this.router.navigateByUrl(`/chat-detail/${chatId}`);
  };
}
