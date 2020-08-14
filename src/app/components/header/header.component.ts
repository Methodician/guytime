import { Component, OnInit, Input } from '@angular/core';
import { PwaService } from '@services/pwa.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() options: HeaderOptionMapT;
  // Icon will not display without a backLocation
  @Input() backLocation: string;

  promptEvent;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private pwaSvc: PwaService,
  ) {
    this.pwaSvc.promptEvent$.subscribe(e => (this.promptEvent = e));
  }

  ngOnInit(): void {}

  onBackClicked = () => {
    this.router.navigateByUrl(this.backLocation);
  };

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.authSvc.logout();
}

export type HeaderOptionMapT = Map<string, HeaderOptionI>;

export interface HeaderOptionI {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}
