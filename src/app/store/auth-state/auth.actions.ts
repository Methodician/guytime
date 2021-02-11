import { createAction, props } from '@ngrx/store';

export const LOGIN = '[Auth] Initiate Login';
export const LOGIN_SUCCESS = '[Auth] Login Succeeded';
export const LOGIN_FAILURE = '[Auth] Login Faied';

export const login = createAction(
  LOGIN,
  props<{ email: string; password: string }>(),
);
