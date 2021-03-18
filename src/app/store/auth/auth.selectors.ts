import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthStateT } from './auth.reducer';

export const authState = createFeatureSelector<AuthStateT>(authFeatureKey);

export const authInfo = createSelector(authState, info => info);

export const isLoggedIn = createSelector(authState, info => !!info.uid);

export const authUid = createSelector(authState, info => info?.uid);
