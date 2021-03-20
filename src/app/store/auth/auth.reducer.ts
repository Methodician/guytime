import { AuthInfoI } from '@app/models/auth-info';
import { createReducer, on } from '@ngrx/store';
import { loadAuthSuccess } from './auth.actions';

const NULL_USER: AuthInfoI = { uid: null };

export const authFeatureKey = 'auth';

export type AuthStateT = AuthInfoI;

export const initialState: AuthStateT = NULL_USER;

export const authReducer = createReducer(
  initialState,
  on(loadAuthSuccess, (_, action) => action.authInfo),
);
