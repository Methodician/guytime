import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { authUid } from '@app/auth/auth.selectors';
import { UserService } from '@app/services/user.service';
import { Store } from '@ngrx/store';
import { debounceTime, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'gtm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentSelection: string;
  unreadMessagesCount: number;

  constructor(
    private router: Router,
    private userSvc: UserService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe($e => {
      if ($e instanceof NavigationEnd) {
        const { url } = $e;
        const parts = url.split('/');
        const base = parts[1];
        this.currentSelection = base;
      }
    });
    this.watchUnreadMessages();
  }

  onNavClicked = (route: string) => {
    this.router.navigateByUrl(`/${route}`);
  };

  watchUnreadMessages = () => {
    this.store
      .select(authUid)
      .pipe(
        switchMap(uid => this.userSvc.unreadMessagesDoc(uid).valueChanges()),
        debounceTime(5000),
      )
      .subscribe(unreadMessagesMap => {
        if (!unreadMessagesMap) return;

        const count = Object.keys(unreadMessagesMap).length;
        this.unreadMessagesCount = count;
      });
  };
}
