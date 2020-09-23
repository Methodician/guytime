import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UserService } from '@app/services/user.service';
import { map, switchMap } from 'rxjs/operators';

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
    private authSvc: AuthService,
    private userSvc: UserService,
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

  onNavSelected = $e => {
    this.router.navigate([`/${$e.value}`]);
  };

  watchUnreadMessages = () => {
    this.authSvc.authInfo$
      .pipe(
        map(info => info.uid),
        switchMap(uid => this.userSvc.unreadMessagesDoc(uid).valueChanges()),
      )
      .subscribe(unreadMessagesMap => {
        const count = Object.keys(unreadMessagesMap).length;
        this.unreadMessagesCount = count;
      });
  };
}
