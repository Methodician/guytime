import { createSelector } from '@ngrx/store';

import { AppState } from './app.state';

export const selectFellas = createSelector(
  (state: AppState) => state.testFellasState.fellas,
  fellas => fellas,
);

export const selectContactIds = createSelector(
  (state: AppState) => state.testFellasState.contactsIds,
  contactIds => contactIds,
);

export const selectCurrentFellaIndex = createSelector(
  (state: AppState) => state.testFellasState.currentFellaIndex,
  currentFellaIndex => currentFellaIndex,
);

export const selectCurrentFella = createSelector(
  selectFellas,
  selectCurrentFellaIndex,
  (fellas, currentFellaIndex) => fellas[currentFellaIndex],
);
