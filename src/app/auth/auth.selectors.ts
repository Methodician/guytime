import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthInfo = createSelector(
  (state: any) => state.auth.authInfo,
  info => info,
);

export const selectIsLoggedIn = createSelector(
  (state: any) => state.auth.authInfo,
  info => !!info.uid,
);

export const selectAuthUid = createSelector(
  (state: any) => state.auth.authInfo,
  info => info.uid,
);
