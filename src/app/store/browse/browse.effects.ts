import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap } from 'rxjs/operators';
import { addFella, addFellaFailure, addFellaSuccess } from './browse.actions';

@Injectable()
export class BrowseEffects {
  constructor(private actions$: Actions, private userSvc: UserService) {}

  addContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFella),
      exhaustMap(async action => {
        await this.userSvc.addUserContact(action.myUid, action.theirUid);
        alert('Contact saved! To view your contacts look in your profile menu');

        return addFellaSuccess();
      }),
      catchError(error => {
        alert(
          `The contact could not be saved. This was the error: ${error.toString()}`,
        );
        return of(addFellaFailure({ error }));
      }),
    ),
  );
}
