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

  logout$ = () => from(this.afAuth.signOut());
}
