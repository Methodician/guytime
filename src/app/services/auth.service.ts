import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthInfo } from '../models/auth-info';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  NULL_USER = new AuthInfo(null, false, null, null);

  authInfo$ = new BehaviorSubject(this.NULL_USER);

  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.isLoggedIn$ = this.afAuth.user.pipe(map(user => user && !!user.uid));

    this.afAuth.user.subscribe(user => {
      if (user) {
        this.authInfo$.next(
          new AuthInfo(
            user.uid,
            user.emailVerified,
            user.displayName,
            user.email,
          ),
        );
      } else {
        this.authInfo$.next(this.NULL_USER);
      }
    });
  }

  register = async (email: string, password: string) => {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password,
      );
      this.router.navigate(['/me']);
      return credential;
    } catch (error) {
      alert(error);
      return null;
    }
  };

  signIn = async (email: string, password: string) => {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password,
      );
      this.router.navigate(['/me']);
      return credential;
    } catch (error) {
      alert(error);
      return null;
    }
  };

  logout = () => {
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  };
}