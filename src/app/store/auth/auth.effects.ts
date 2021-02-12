import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthInfo } from '@app/models/auth-info';
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
} from './auth.actions';

// TODO: stop duplicating this object
const NULL_USER = new AuthInfo(null, false, null, null);

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
        this.authSvc.login$(action.email, action.password).pipe(
          tap(_ => this.router.navigateByUrl('/')),
          map(credential => loginSuccess({ credential })),
        ),
      ),
      catchError(error => of(loginFailure({ error }))),
    ),
  );

  authInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAuth),
      exhaustMap(_ => this.afAuth.user),
      map(user =>
        user
          ? loadAuthSuccess({
              authInfo: new AuthInfo(
                user.uid,
                user.emailVerified,
                user.displayName,
                user.email,
              ),
            })
          : loadAuthSuccess({ authInfo: NULL_USER }),
      ),
      catchError(error => of(loadAuthFailure({ error }))),
    ),
  );
}
