import { Component, OnInit, Input } from '@angular/core';
import { PwaService } from 'src/app/services/pwa.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() options: IHeaderOption[];
  // Icon will not display without a backLocation
  @Input() backLocation: string;

  promptEvent;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private pwaSvc: PwaService,
  ) {
    this.pwaSvc.promptEvent.subscribe(e => (this.promptEvent = e));
  }

  ngOnInit(): void {}

  onBackClicked = () => {
    console.log(this.backLocation);
    this.router.navigateByUrl(this.backLocation);
  };

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.authSvc.logout();
}

export interface IHeaderOption {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}
