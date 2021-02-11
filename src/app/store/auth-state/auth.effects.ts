import { Injectable } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { login, LOGIN_FAILURE, LOGIN_SUCCESS } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authSvc: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(action => {
        console.log(action);
        return this.authSvc.signIn(action.email, action.password);
      }),
      map(credential => ({
        type: LOGIN_SUCCESS,
        credential,
      })),
      catchError(error => of({ type: LOGIN_FAILURE, error })),
    ),
  );
}
