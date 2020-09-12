import { Component, OnInit, Input } from '@angular/core';
import { MessageI } from '@models/message';

@Component({
  selector: 'gtm-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() chatMessage: any;
  // @Input() chatMessage: MessageI; // later we'll switch it back to this

  constructor() {}

  ngOnInit(): void {}
}
