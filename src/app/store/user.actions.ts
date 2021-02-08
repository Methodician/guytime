import { UserI } from '@app/models/user';
import { createAction, props, Action } from '@ngrx/store';

export const NEXT_FELLA = '[USER] Next';
export const ADD_FELLA = '[USER] Add';

// NgRx Docs
export const nextFella = createAction(NEXT_FELLA);
export const addFella = createAction(ADD_FELLA);

// Fireship Vid
export class NextFella implements Action {
  readonly type = NEXT_FELLA;
}

export class AddFella implements Action {
  readonly type = ADD_FELLA;

  constructor(public payload: UserI) {}
}

export type All = NextFella | AddFella;
