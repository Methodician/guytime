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
  // Icon will not display without a XAction
  XAction$: BehaviorSubject<() => void> = new BehaviorSubject(null);

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
    this.XAction$ = this.headerSvc.XAction$;
  }

  ngOnDestroy(): void {
    this.headerSvc.resetHeader();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onXClicked = () => {
    const XAction = this.XAction$.value;
    XAction();
  };

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.authSvc.logout();
}
