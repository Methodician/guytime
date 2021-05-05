import { createFeatureSelector, createSelector } from '@ngrx/store';
import { headerFeatureKey, HeaderStateI } from './header.reducer';

export const headerState = createFeatureSelector<HeaderStateI>(
  headerFeatureKey,
);
