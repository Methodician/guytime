import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';

import { AuthEffects } from '@app/store/auth/auth.effects';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}
}

export const allEffects = [AuthEffects, AppEffects];
