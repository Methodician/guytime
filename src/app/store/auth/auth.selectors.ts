import { StateI } from '@app/store';
import { createSelector } from '@ngrx/store';

export const authInfo = createSelector(
  (state: StateI) => state.auth,
  info => info,
);

export const isLoggedIn = createSelector(
  (state: StateI) => state.auth,
  info => !!info.uid,
);

export const authUid = createSelector(
  (state: StateI) => state.auth,
  info => info.uid,
);
