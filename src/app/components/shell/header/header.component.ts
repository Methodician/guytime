import { Component, OnInit } from '@angular/core';
import { PwaService } from '@services/pwa.service';
import { HeaderService, HeaderOptionMapT } from '@app/services/header.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { logout } from '@app/store/auth/auth.actions';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();

  options$: BehaviorSubject<HeaderOptionMapT> = new BehaviorSubject(new Map());
  headerText$: BehaviorSubject<string> = new BehaviorSubject('Fellas');
  shouldShowBack$ = new BehaviorSubject(false);

  promptEvent;

  constructor(
    private store: Store,
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

  onBackClicked = () => {
    this.headerSvc.onBackClicked();
  };

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.store.dispatch(logout());
}
