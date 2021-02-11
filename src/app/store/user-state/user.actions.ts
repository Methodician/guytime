import { UserI } from '@app/models/user';
import { createAction, props } from '@ngrx/store';

export const USER_AUTHENTICATED = '[User] Authenticated';
export const CURRENT_USER_LOADED = '[User] Current User Loaded';
export const CURRENT_USER_LOAD_FAILED = '[User] Current User Load Failed';

export const userAuthenticated = createAction(
  USER_AUTHENTICATED,
  props<{ uid: string }>(),
);

export const currentUserLoaded = createAction(
  CURRENT_USER_LOADED,
  props<{ user: UserI }>(),
);
