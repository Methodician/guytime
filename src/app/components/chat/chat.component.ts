import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HeaderService } from '@app/services/header.service';

@Component({
  selector: 'gtm-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chatList') private chatListEl: ElementRef;
  msgInput = '';
  chats = [];

  constructor(private headerSvc: HeaderService) {}

  ngOnInit(): void {
    this.chats = [
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
      {
        sender: 'Jim',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'Totes but I dig it too. I mean we can chat all day',
        timestamp: new Date(),
      },
      {
        sender: 'Nathan',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'I like chatting with you guys',
        timestamp: new Date(),
      },
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
      {
        sender: 'Jim',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'Totes but I dig it too. I mean we can chat all day',
        timestamp: new Date(),
      },
      {
        sender: 'Nathan',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'I like chatting with you guys',
        timestamp: new Date(),
      },
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
      {
        sender: 'Jim',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'Totes but I dig it too. I mean we can chat all day',
        timestamp: new Date(),
      },
      {
        sender: 'Nathan',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'I like chatting with you guys',
        timestamp: new Date(),
      },
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
      {
        sender: 'Jim',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'Totes but I dig it too. I mean we can chat all day',
        timestamp: new Date(),
      },
      {
        sender: 'Nathan',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'I like chatting with you guys',
        timestamp: new Date(),
      },
      {
        sender: 'Andy',
        avatar:
          'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
        text: `but that's nothing new. We have been chatting for like a month and we keep comming back so someone must be having fun. I mean look at me. I'm a puffer fish...`,
        timestamp: new Date(),
      },
      {
        sender: 'Jim',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'Totes but I dig it too. I mean we can chat all day',
        timestamp: new Date(),
      },
      {
        sender: 'Nathan',
        avatar: 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        text: 'I like chatting with you guys',
        timestamp: new Date(),
      },
    ];

    this.updateHeader();
  }

  updateHeader = () => {
    this.headerSvc.clearHeaderOptions();

    this.headerSvc.setHeaderOption('people', {
      iconName: 'people',
      optionText: 'People',
      isDisabled: false,
      onClick: this.logClicked,
    });
  };

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    try {
      this.chatListEl.nativeElement.scrollTop = this.chatListEl.nativeElement.scrollHeight;
    } catch (error) {}
  }

  logClicked = () => console.log('clicked');

  sendMessage = () => {
    const message = {
      sender: 'Andy',
      avatar:
        'https://thumbs-prod.si-cdn.com/qXrJJ-l_jMrQbARjnToD0fi-Tsg=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/d6/93/d6939718-4e41-44a8-a8f3-d13648d2bcd0/c3npbx.jpg',
      text: this.msgInput,
      timestamp: new Date(),
    };
    this.chats.push(message);
    this.msgInput = '';
  };
}
