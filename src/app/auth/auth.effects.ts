import { Injectable } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { login, loginFailure, loginSuccess } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authSvc: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(action =>
        this.authSvc
          .login$(action.email, action.password)
          .pipe(map(credential => loginSuccess({ credential }))),
      ),
      catchError(error => of(loginFailure({ error }))),
    ),
  );
}
