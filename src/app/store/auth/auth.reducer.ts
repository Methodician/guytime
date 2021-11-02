import { AuthInfoI } from '@app/models/auth-info';
import { createReducer, on }                                             from '@ngrx/store';
import { loadAuthSuccess, loginFailure, logoutSuccess, registerFailure } from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthStateI {
  authInfo: AuthInfoI;
  authError: any;
}

export const initialState: AuthStateI = {
  authInfo: null,
  authError: null,
};

export const authReducer = createReducer(
  initialState,
  on(loadAuthSuccess, (_, action) => ({
    authInfo: action.authInfo,
    authError: null,
  })),
  on(loginFailure, (state, action) => ({ ...state, authError: action.error })),
  on(registerFailure, (state, action) => ({ ...state, authError: action.error })),
  on(logoutSuccess, ( state, ) => ({ ...state, authInfo: null })),
);
