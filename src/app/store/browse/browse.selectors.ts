import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StateI } from '@app/store/index';

export const currentUserIndex = createSelector(
  (state: StateI) => state.browse.browseIndex,
  anything => anything,
);
