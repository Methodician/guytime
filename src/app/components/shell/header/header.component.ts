import { Component, OnDestroy, OnInit } from '@angular/core';
import { PwaService } from '@services/pwa.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { logout } from '@app/store/auth/auth.actions';
import {
  backButtonClicked,
  resetHeader,
} from '@app/store/header/header.actions';
import {
  headerOptions,
  headerText,
  shouldShowBack,
} from '@app/store/header/header.selectors';

@Component({
  selector: 'gtm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  options$ = this.store.select(headerOptions);
  headerText$ = this.store.select(headerText);
  shouldShowBack$ = this.store.select(shouldShowBack);

  promptEvent;

  constructor(private store: Store, private pwaSvc: PwaService) {
    this.pwaSvc.promptEvent$.subscribe(e => (this.promptEvent = e));
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetHeader());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onBackClicked = () => {
    this.store.dispatch(backButtonClicked());
  }

  installPwa = () => this.promptEvent.prompt();

  logout = () => this.store.dispatch(logout());
}
