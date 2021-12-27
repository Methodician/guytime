import { createFeatureSelector, createSelector }                         from '@ngrx/store';
import { bottomSheetFeatureKey, BottomSheetStateI } from './bottom-sheet.reducer';

export const bottomSheetState = createFeatureSelector<BottomSheetStateI>(
  bottomSheetFeatureKey,
);

export const isBottomSheetOpen = createSelector(
  bottomSheetState,
  state => state.isBottomSheetOpen,
);
