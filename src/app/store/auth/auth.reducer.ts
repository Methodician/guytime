import { AuthInfo } from '@app/models/auth-info';
import { createReducer, on } from '@ngrx/store';
import { loadAuthSuccess } from './auth.actions';

const NULL_USER = new AuthInfo(null, false, null, null);

export const authFeatureKey = 'auth';

export type AuthStateT = AuthInfo;

export const initialState: AuthStateT = NULL_USER;

export const authReducer = createReducer(
  initialState,
  on(loadAuthSuccess, (_, action) => action.authInfo),
);
