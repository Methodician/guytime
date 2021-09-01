import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthInfoI } from '@app/models/auth-info';
import { AuthService } from '@app/services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
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
      exhaustMap(action =>
        from(
          this.afAuth.signInWithEmailAndPassword(action.email, action.password),
        ).pipe(
          tap(credential => {
            if (!!credential?.user?.uid) {
              this.router.navigateByUrl('/guys');
            }
          }),
          map(_ => loginSuccess({ credential: null })),
          catchError(error => of(loginFailure({ error }))),
        ),
      ),
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
      switchMap(action => {
        return from(
          this.afAuth.createUserWithEmailAndPassword(
            action.email,
            action.password,
          ),
        ).pipe(
          tap(credential => {
            if (!!credential?.user?.uid) {
              this.router.navigateByUrl('/me/edit');
            }
          }),
          map(_ => registerSuccess({ credential: null })),
          catchError(error => of(registerFailure({ error }))),
        );
      }),
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
