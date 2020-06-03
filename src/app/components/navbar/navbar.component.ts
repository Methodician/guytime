import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'gtm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentSelection: string;
  isLoggedIn = false;
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private authSvc: AuthService) {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
  }

  ngOnInit(): void {
    this.router.events.subscribe($e => {
      if ($e instanceof NavigationEnd) {
        const { url } = $e;
        const parts = url.split('/');
        const base = parts[1];
        this.currentSelection = base;
      }
    });
  }

  onNavSelected = $e => {
    this.router.navigate([`/${$e.value}`]);
  };
}
