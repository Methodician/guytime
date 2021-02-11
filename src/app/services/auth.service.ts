import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthInfo } from '@models/auth-info';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  NULL_USER = new AuthInfo(null, false, null, null);

  authInfo$ = new BehaviorSubject(this.NULL_USER);

  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.isLoggedIn$ = this.afAuth.user.pipe(map(user => !!user && !!user.uid));

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

      return { credential };
    } catch (error) {
      alert(error);
      return null;
    }
  };

  login$ = (email: string, password: string) =>
    from(this.afAuth.signInWithEmailAndPassword(email, password));

  signIn = async (email: string, password: string) => {
    const wasSignInErrorUnhandled = error =>
      !!error &&
      !!error.code &&
      error.code !== 'auth/wrong-password' &&
      error.code !== 'auth/user-not-found';

    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password,
      );
      return credential;
    } catch (error) {
      if (wasSignInErrorUnhandled(error)) console.error(error);

      return error;
    }
  };

  logout = () => {
    this.afAuth.signOut();
    this.router.navigateByUrl('/landing');
  };
}
