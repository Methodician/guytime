import { createReducer, on } from '@ngrx/store';
import {
  openBottomSheet,
  closeBottomSheet,
} from './bottom-sheet.actions';

export const bottomSheetFeatureKey = 'bottomSheet';

export interface BottomSheetStateI {
  isBottomSheetOpen: boolean;
}

export const initialState: BottomSheetStateI = {
  isBottomSheetOpen: false,
};

export const bottomSheetReducer = createReducer(
  initialState,
  on(openBottomSheet, (state, { }) => ({
    ...state,
    isBottomSheetOpen: true,
  })),
  on(closeBottomSheet, (state, { }) => ({
    ...state,
    isBottomSheetOpen: false,
  })),

);
