import { AuthInfoI } from '@app/models/auth-info';
import { createReducer, on } from '@ngrx/store';
import { loadAuthSuccess, loginFailure } from './auth.actions';

const NULL_USER: AuthInfoI = { uid: null };

export const authFeatureKey = 'auth';

export interface AuthStateI {
  authInfo: AuthInfoI;
  authError: any;
}

export const initialState: AuthStateI = {
  authInfo: NULL_USER,
  authError: null,
};

export const authReducer = createReducer(
  initialState,
  on(loadAuthSuccess, (_, action) => ({
    authInfo: action.authInfo,
    authError: null,
  })),
  on(loginFailure, (state, action) => ({ ...state, authError: action.error })),
);
