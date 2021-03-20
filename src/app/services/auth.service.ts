import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  register$ = (email: string, password: string) =>
    from(this.afAuth.createUserWithEmailAndPassword(email, password));

  // login$ = (email: string, password: string) =>
  //   from(this.afAuth.signInWithEmailAndPassword(email, password));

  // signIn = async (email: string, password: string) => {
  //   const wasSignInErrorUnhandled = error =>
  //     !!error &&
  //     !!error.code &&
  //     error.code !== 'auth/wrong-password' &&
  //     error.code !== 'auth/user-not-found';

  //   try {
  //     const credential = await this.afAuth.signInWithEmailAndPassword(
  //       email,
  //       password,
  //     );
  //     return credential;
  //   } catch (error) {
  //     if (wasSignInErrorUnhandled(error)) console.error(error);

  //     return error;
  //   }
  // };

  logout$ = () => from(this.afAuth.signOut());
}
