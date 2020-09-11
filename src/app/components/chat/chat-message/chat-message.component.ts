import { Component, OnInit, Input } from '@angular/core';
import { MessageI } from '@models/message';

@Component({
  selector: 'gtm-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() chatMessage: MessageI;

  constructor() {}

  ngOnInit(): void {}
}
