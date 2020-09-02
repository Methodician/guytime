import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'gtm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentSelection: string;

  constructor(private router: Router) {}

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
