import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import {
  addFella,
  addFellaFailure,
  addFellaSuccess,
  nextFella,
  nextFellaSuccess,
} from './browse.actions';
import { browseIndex, maxBrowseIndex } from './browse.selectors';

@Injectable()
export class BrowseEffects {
  constructor(
    private actions$: Actions,
    private userSvc: UserService,
    private store: Store,
  ) {}

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

  nextFella$ = createEffect(() =>
    this.actions$.pipe(
      ofType(nextFella),
      exhaustMap(_ =>
        combineLatest([
          this.store.select(maxBrowseIndex),
          this.store.select(browseIndex),
        ]).pipe(
          take(1),
          map(([maxIndex, currentIndex]) =>
            currentIndex >= maxIndex ? 0 : currentIndex + 1,
          ),
          tap(newIndex => {
            if (newIndex === 0)
              alert(
                "That's everyone in the app. Please invite your friends to join! In the mean time, we'll start back from the beginning.",
              );
          }),
          map(newIndex => nextFellaSuccess({ newIndex })),
        ),
      ),
    ),
  );
}
