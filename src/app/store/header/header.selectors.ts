import { createFeatureSelector, createSelector } from '@ngrx/store';
import { headerFeatureKey, HeaderStateI } from './header.reducer';

export const headerState = createFeatureSelector<HeaderStateI>(
  headerFeatureKey,
);

export const shouldShowBack = createSelector(
  headerState,
  state => state.shouldShowBack,
);

export const headerText = createSelector(
  headerState,
  state => state.headerText,
);
