import { Component, OnInit,  }               from '@angular/core';
import { navIconMap, activityIconMap, buttonIconMap } from './models/icon-maps';
import { MatIconRegistry }                            from '@angular/material/icon';
import { DomSanitizer }                               from '@angular/platform-browser';
import { Store }                              from '@ngrx/store';
import { loadAuth }                                   from '@app/store/auth/auth.actions';
import { loadUsers }                                  from './store/user/user.actions';
import { watchNavigation }                            from './store/header/header.actions';
import { loggedInUser }                               from '@app/store/user/user.selectors';
import { takeUntil }                                  from 'rxjs/operators';
import { Subject }                                    from 'rxjs';
import { closeBottomSheet }                           from '@app/store/bottom-sheet/bottom-sheet.actions';

@Component({
  selector: 'gtm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  loggedIn = false;

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

  ngOnInit(): void {
    this.watchLoggedInUser();
    this.store.dispatch(closeBottomSheet());
  }

  watchLoggedInUser = () => {
    this.store
      .select(loggedInUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if ( !user || !user.uid ) {
          this.loggedIn = false;
        }
        if (user && user.uid) {
          this.loggedIn = true;
        }
      });
  }
}
