import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StateI } from '@app/store/index';

export const browseIndex = createSelector(
  (state: StateI) => state.browse.browseIndex,
  index => index,
);