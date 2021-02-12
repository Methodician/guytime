import { AuthInfo } from '@app/models/auth-info';
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

export const loadAuth = createAction('[Auth] Load Auth');

export const loadAuthSuccess = createAction(
  '[Auth] Load Auth Success',
  props<{ authInfo: AuthInfo }>(),
);

export const loadAuthFailure = createAction(
  '[Auth] Load Auth Failure',
  props<{ error: any }>(),
);
