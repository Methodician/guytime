import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { navIconMap, activityIconMap, buttonIconMap } from './models/icon-maps';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { loadAuth } from './auth/auth.actions';
import { selectIsLoggedIn } from './auth/auth.selectors';

@Component({
  selector: 'gtm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private store: Store,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    this.store.dispatch(loadAuth());

    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));

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
