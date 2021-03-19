import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import { loadUsers, loadUsersSuccess } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userSvc: UserService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      exhaustMap(_ =>
        this.userSvc
          .namedUsersRef()
          .valueChanges({ idField: 'uid' })
          .pipe(map(users => loadUsersSuccess({ users }))),
      ),
    ),
  );
}
