import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isLoggedIn = false;
  userName: string;
  password: string;

  login = (userName: string, password: string) => {
    this.userName = userName;
    this.password = password;
    this.isLoggedIn = true;
    this.router.navigate(['/guys']);
  };

  logout = () => {
    this.userName = null;
    this.password = null;
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  };
}
