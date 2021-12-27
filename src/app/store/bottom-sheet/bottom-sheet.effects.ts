import { Injectable } from '@angular/core';
import { Router, } from '@angular/router';
import { Actions, } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class BottomSheetEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
  ) {}


}
