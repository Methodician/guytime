import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUserUnreadMessages } from '@app/store/chat/chat.actions';
import { unreadMessagesCountForUser } from '@app/store/chat/chat.selectors';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'gtm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentSelection$: Observable<string>;
  unreadMessagesCount$ = this.store.select(unreadMessagesCountForUser);

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.currentSelection$ = this.router.events.pipe(
      filter($e => $e instanceof NavigationEnd),
      map(($e: NavigationEnd) => {
        const { url } = $e;
        const parts = url.split('/');
        const base = parts[1];
        return base;
      }),
    );

    this.store.dispatch(loadUserUnreadMessages());
  }

  onNavClicked = (route: string) => {
    this.router.navigateByUrl(`/${route}`);
  };
}
