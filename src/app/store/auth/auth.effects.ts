import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthInfoI } from '@app/models/auth-info';
import { AuthService } from '@app/services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import {
  loadAuth,
  loadAuthFailure,
  loadAuthSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  register,
  registerSuccess,
  registerFailure,
} from './auth.actions';

// TODO: stop duplicating this object
const NULL_USER: AuthInfoI = { uid: null };

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authSvc: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(action => {
        this.afAuth
          .signInWithEmailAndPassword(action.email, action.password)
          .then(credential => {
            if (!!credential?.user?.uid) {
              this.router.navigateByUrl('/guys');
            }
          });
        return of(loginSuccess({ credential: null }));
      }),
      catchError(error => of(loginFailure({ error }))),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(_ =>
        this.authSvc.logout$().pipe(
          tap(_ => this.router.navigateByUrl('/landing')),
          map(_ => logoutSuccess()),
        ),
      ),
      catchError(error => of(logoutFailure({ error }))),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      exhaustMap(action =>
        this.authSvc.register$(action.email, action.password).pipe(
          tap(_ => this.router.navigateByUrl('/me/edit')),
          map(credential => registerSuccess({ credential })),
        ),
      ),
      catchError(error => of(registerFailure({ error }))),
    ),
  );

  loadAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAuth),
      exhaustMap(_ => this.afAuth.user),
      map(user =>
        user
          ? loadAuthSuccess({
              authInfo: { uid: user.uid, email: user.email },
            })
          : loadAuthSuccess({ authInfo: NULL_USER }),
      ),
      catchError(error => of(loadAuthFailure({ error }))),
    ),
  );
}
