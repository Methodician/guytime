import { createAction, props } from '@ngrx/store';

export const nextFellaClick = createAction(
  '[Browse] Next Clicked',
  props<{ maxIndex: number }>(),
);

export const nextFella = createAction(
  '[Browse] Next Fella',
  props<{ newIndex: number }>(),
);

export const addFella = createAction(
  '[Browse] Add Contact',
  props<{ uid: string }>(),
);
