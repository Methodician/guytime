import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Initiate Login',
  props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ credential: any }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failed',
  props<{ error: any }>(),
);

export const loadAuth = createAction('[Auth] Load Auths');

export const loadAuthSuccess = createAction(
  '[Auth] Load Auths Success',
  props<{ data: any }>(),
);

export const loadAuthFailure = createAction(
  '[Auth] Load Auths Failure',
  props<{ error: any }>(),
);
