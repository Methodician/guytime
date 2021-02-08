import { UserI } from '@app/models/user';
import { createAction, props } from '@ngrx/store';

export const LOAD_FELLAS = '[Browse Page] Load Fellas';
export const FELLAS_LOADED = '[Firestore] Named Users Loaded Success';
export const FELLAS_LOAD_FAILED = '[Firestore] Named users Loaded Error';
export const NEXT_FELLA = '[USER] Next';
export const ADD_FELLA = '[USER] Add';

export const loadFellas = createAction(LOAD_FELLAS);

export const fellasLoaded = createAction(
  FELLAS_LOADED,
  props<{ users: UserI[] }>(),
);

export const fellasLoadFailed = createAction(FELLAS_LOAD_FAILED);

export const nextFella = createAction(NEXT_FELLA);

export const addFella = createAction(ADD_FELLA, props<{ uid: string }>());
