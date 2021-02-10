import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import {
  CURRENT_USER_LOADED,
  CURRENT_USER_LOAD_FAILED,
  userAuthenticated,
} from './user.actions';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userSvc: UserService) {}

  loadCurrentUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userAuthenticated),
      exhaustMap(action =>
        this.userSvc
          .userRef(action.uid)
          .valueChanges()
          .pipe(
            map(user => ({
              type: CURRENT_USER_LOADED,
              user: user,
            })),
            catchError(() => of({ type: CURRENT_USER_LOAD_FAILED })),
          ),
      ),
    ),
  );
}
