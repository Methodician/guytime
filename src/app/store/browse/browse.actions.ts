import { createAction, props } from '@ngrx/store';

export const nextFella = createAction('[Browse] Next Fella');

export const nextFellaSuccess = createAction(
  '[Browse] Successfully cycled to next fella',
  props<{ newIndex: number }>(),
);

export const addFella = createAction(
  '[Browse] Add Contact',
  props<{ myUid: string; theirUid: string }>(),
);

export const addFellaSuccess = createAction(
  '[Browse] Contact Added Successfully',
);

export const addFellaFailure = createAction(
  '[Browse] Failed to Add Contact',
  props<{ error: any }>(),
);
