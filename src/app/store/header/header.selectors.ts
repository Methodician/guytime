import { createFeatureSelector, createSelector } from '@ngrx/store';
import { headerFeatureKey, HeaderStateI } from './header.reducer';

export const headerState = createFeatureSelector<HeaderStateI>(
  headerFeatureKey,
);

export const shouldShowBack = createSelector(
  headerState,
  state => state.shouldShowBack,
);

export const shouldHide = createSelector(
  headerState,
  state => state.shouldHide,
);

export const headerText = createSelector(
  headerState,
  state => state.headerText,
);

export const headerOptions = createSelector(
  headerState,
  state => state.headerOptions,
);
