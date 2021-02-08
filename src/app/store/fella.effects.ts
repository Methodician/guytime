import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';

import {
  FELLAS_LOADED,
  FELLAS_LOAD_FAILED,
  LOAD_FELLAS,
} from './fella.actions';

@Injectable()
export class FellaEffects {
  constructor(private actions$: Actions, private userSvc: UserService) {}

  loadNamedFellas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_FELLAS),
      mergeMap(() =>
        this.userSvc
          .namedUsersRef()
          .valueChanges({ idField: 'uid' })
          .pipe(
            map(users => ({
              type: FELLAS_LOADED,
              users: users,
            })),
            catchError(() => of({ type: FELLAS_LOAD_FAILED })),
          ),
      ),
    ),
  );
}
