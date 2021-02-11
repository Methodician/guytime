import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import {
  CURRENT_USER_LOADED,
  CURRENT_USER_LOAD_FAILED,
  userAuthenticated,
} from './user.actions';
import {
  catchError,
  exhaustMap,
  mergeMap,
  map,
  take,
  switchMap,
} from 'rxjs/operators';
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
          .valueChanges({ idField: 'uid' })
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

  // loadUserContacts$ = createEffect(() =>
  //   this.actions$.pipe(ofType(loadUserContacts),
  //   exhaustMap(action => {
  //     action.uids.map(uid => this.userSvc.userRef(uid).valueChanges().pipe(take(1)))
  //   })
  //   ),
  // );
}
