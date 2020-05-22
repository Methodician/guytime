import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PwaService } from 'src/app/services/pwa.service';

@Component({
  selector: 'gtm-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  promptEvent;

  constructor(private authSvc: AuthService, private pwaSvc: PwaService) {
    this.pwaSvc.promptEvent.subscribe(e => (this.promptEvent = e));
  }

  ngOnInit(): void {}

  logout = () => this.authSvc.logout();

  installPwa = () => this.promptEvent.prompt();
}
