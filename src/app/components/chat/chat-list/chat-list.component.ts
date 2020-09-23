import { Component, OnInit } from '@angular/core';
import { ChatGroupI } from '@app/models/chat-group';
import { AuthService } from '@app/services/auth.service';
import { ChatService } from '@app/services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'gtm-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  chatList$: Observable<ChatGroupI[]>;

  constructor(private chatSvc: ChatService, private authSvc: AuthService) {}

  ngOnInit(): void {
    this.watchChatList();
  }

  watchChatList = () => {
    const loggedInUid = this.authSvc.authInfo$.value.uid;
    this.chatList$ = this.chatSvc.watchChatsByUser$(loggedInUid);
  };
}
