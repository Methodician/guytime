import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { nextFellaClick } from './browse.actions';

@Injectable()
export class BrowseEffects {
  constructor(private actions$: Actions) {}

  nextFella$ = createEffect(() => this.actions$.pipe(ofType(nextFellaClick)));
}
