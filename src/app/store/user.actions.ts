import { createAction, props } from '@ngrx/store';

export const NEXT_FELLA = '[USER] Next';
export const ADD_FELLA = '[USER] Add';

// NgRx Docs
export const nextFella = createAction(NEXT_FELLA);
// export const addFella = createAction(ADD_FELLA);
export const addFella = createAction(ADD_FELLA, props<{ uid: string }>());
