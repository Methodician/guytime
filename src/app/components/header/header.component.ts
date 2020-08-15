import { Component, OnInit, Input } from '@angular/core';
import { PwaService } from '@services/pwa.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { HeaderService, HeaderOptionMapT } from '@app/services/header.service';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  // Icon will not display without a backLocation
  @Input() backLocation: string;

  options: HeaderOptionMapT;
  promptEvent;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private pwaSvc: PwaService,
    private headerSvc: HeaderService,
  ) {
    this.pwaSvc.promptEvent$.subscribe(e => (this.promptEvent = e));
    this.options = this.headerSvc.headerOptions;
  }

  ngOnInit(): void {}

  onBackClicked = () => {
    this.router.navigateByUrl(this.backLocation);
  };

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.authSvc.logout();
}
