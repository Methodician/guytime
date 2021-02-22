import { createAction, props } from '@ngrx/store';

export const nextFella = createAction(
  '[Browse] Next Fella',
  props<{ maxIndex: number }>(),
);

export const addFella = createAction(
  '[Browse] Add Contact',
  props<{ uid: string }>(),
);
