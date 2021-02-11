import { createSelector } from '@ngrx/store';

import { AppState } from '@app/store/app.state';

export const selectFellas = createSelector(
  (state: AppState) => state.fellaState.fellas,
  fellas => fellas,
);

export const selectOneFella = createSelector(
  (state: AppState, props: { uid: string }) =>
    state.fellaState.fellas.find(users => users.uid === props.uid),
  fella => fella,
);

export const selectCurrentFella = createSelector(
  (state: AppState) =>
    state.fellaState.fellas[state.fellaState.currentFellaIndex],
  fella => fella,
);
