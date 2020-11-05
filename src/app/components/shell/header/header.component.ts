import { Component, OnInit, Input } from '@angular/core';
import { PwaService } from '@services/pwa.service';
import { AuthService } from '@services/auth.service';
import { HeaderService, HeaderOptionMapT } from '@app/services/header.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  options$: BehaviorSubject<HeaderOptionMapT> = new BehaviorSubject(new Map());
  headerText$: BehaviorSubject<string> = new BehaviorSubject('Guy Time');
  shouldShowBack$ = new BehaviorSubject(false);

  promptEvent;

  constructor(
    private authSvc: AuthService,
    private pwaSvc: PwaService,
    private headerSvc: HeaderService,
  ) {
    this.pwaSvc.promptEvent$.subscribe(e => (this.promptEvent = e));
  }

  ngOnInit(): void {
    this.options$ = this.headerSvc.headerOptions$;
    this.headerText$ = this.headerSvc.headerText$;
    this.shouldShowBack$ = this.headerSvc.shouldShowBack$;
  }

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onXClicked = () => {
    this.headerSvc.onXClicked();
  };

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.authSvc.logout();
}
