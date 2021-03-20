import { AuthInfoI } from '@app/models/auth-info';
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

export const logout = createAction('[Auth] Initiate Logout');

export const logoutSuccess = createAction('[Auth] Successfully logged out');

export const logoutFailure = createAction(
  '[Auth] Failed to log out',
  props<{ error: any }>(),
);

export const register = createAction(
  '[Auth] Initiate Registration',
  props<{ email: string; password: string }>(),
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ credential: any }>(),
);

export const registerFailure = createAction(
  '[Auth] Register Failed',
  props<{ error: any }>(),
);

export const loadAuth = createAction('[Auth] Load Auth');

export const loadAuthSuccess = createAction(
  '[Auth] Load Auth Success',
  props<{ authInfo: AuthInfoI }>(),
);

export const loadAuthFailure = createAction(
  '[Auth] Load Auth Failure',
  props<{ error: any }>(),
);
