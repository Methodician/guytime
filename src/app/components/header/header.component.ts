import { Component, OnInit, Input } from '@angular/core';
import { PwaService } from '@services/pwa.service';
import { AuthService } from '@services/auth.service';
import { HeaderService, HeaderOptionMapT } from '@app/services/header.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  options$: BehaviorSubject<HeaderOptionMapT> = new BehaviorSubject(new Map());
  // Icon will not display without a XAction
  XAction$: BehaviorSubject<() => void> = new BehaviorSubject(null);
  headerText$: BehaviorSubject<string> = new BehaviorSubject('Guy Time');

  promptEvent;

  constructor(
    private authSvc: AuthService,
    private pwaSvc: PwaService,
    private headerSvc: HeaderService,
  ) {
    this.pwaSvc.promptEvent$.subscribe(e => (this.promptEvent = e));
  }

  ngOnInit(): void {
    this.headerSvc.XAction$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(action => this.XAction$.next(action));

    this.headerSvc.headerOptions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(headerOptions => this.options$.next(headerOptions));

    this.headerSvc.headerText$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(headerText => {
        this.headerText$.next(headerText);
      });
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
