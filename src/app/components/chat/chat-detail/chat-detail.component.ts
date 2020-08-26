import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  somefunction = id => {
    this.router.navigateByUrl(`/chat-detail/${id}`);
  };
}
