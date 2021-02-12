import { AuthInfo } from '@app/models/auth-info';
import { createReducer, on } from '@ngrx/store';
import { loadAuthSuccess } from './auth.actions';

const NULL_USER = new AuthInfo(null, false, null, null);

export const authFeatureKey = 'auth';

export interface AuthStateI {
  authInfo: AuthInfo;
}

export const initialState: AuthStateI = { authInfo: NULL_USER };

export const authReducer = createReducer(
  initialState,
  on(loadAuthSuccess, (_, action) => ({ authInfo: action.authInfo })),
);
