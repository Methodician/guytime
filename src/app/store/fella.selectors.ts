import { createSelector } from '@ngrx/store';

import { AppState } from './app.state';

export const selectFellas = createSelector(
  (state: AppState) => state.fellaState.fellas,
  fellas => fellas,
);

export const selectCurrentFella = createSelector(
  (state: AppState) =>
    state.fellaState.fellas[state.fellaState.currentFellaIndex],
  fella => fella,
);
