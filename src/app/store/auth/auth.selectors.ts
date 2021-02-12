import { StateI } from '@app/reducers';
import { createSelector } from '@ngrx/store';

export const authInfo = createSelector(
  (state: StateI) => state.auth.authInfo,
  info => info,
);

export const isLoggedIn = createSelector(
  (state: StateI) => state.auth.authInfo,
  info => !!info.uid,
);

export const authUid = createSelector(
  (state: StateI) => state.auth.authInfo,
  info => info.uid,
);
