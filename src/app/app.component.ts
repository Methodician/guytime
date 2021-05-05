import { Component } from '@angular/core';
import { navIconMap, activityIconMap, buttonIconMap } from './models/icon-maps';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { loadAuth } from '@app/store/auth/auth.actions';
import { isLoggedIn } from '@app/store/auth/auth.selectors';
import { loadUsers } from './store/user/user.actions';
import { watchNavigation } from './store/header/header.actions';

@Component({
  selector: 'gtm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn$ = this.store.pipe(select(isLoggedIn));

  constructor(
    private store: Store,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    this.store.dispatch(loadAuth());
    this.store.dispatch(loadUsers());
    this.store.dispatch(watchNavigation());

    Object.entries(navIconMap).map(([name, path]) =>
      iconRegistry.addSvgIcon(
        name,
        sanitizer.bypassSecurityTrustResourceUrl(path),
      ),
    );

    Object.entries(activityIconMap).map(([name, path]) =>
      iconRegistry.addSvgIcon(
        name,
        sanitizer.bypassSecurityTrustResourceUrl(path),
      ),
    );

    Object.entries(buttonIconMap).map(([name, path]) =>
      iconRegistry.addSvgIcon(
        name,
        sanitizer.bypassSecurityTrustResourceUrl(path),
      ),
    );
  }
}
