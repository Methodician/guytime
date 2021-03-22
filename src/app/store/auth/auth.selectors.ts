import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthStateI } from './auth.reducer';

export const authState = createFeatureSelector<AuthStateI>(authFeatureKey);

export const authInfo = createSelector(authState, state => state.authInfo);

export const isLoggedIn = createSelector(authInfo, info => !!info.uid);

export const authUid = createSelector(authInfo, info => info?.uid);

export const authError = createSelector(authState, state => state.authError);
