import { createReducer, on } from '@ngrx/store';
import { nextFella } from './browse.actions';

export const browseFeatureKey = 'browse';

export interface BrowseStateI {
  browseIndex: number;
}

export const initialState: BrowseStateI = {
  browseIndex: 0,
};

export const browseReducer = createReducer(
  initialState,
  on(nextFella, (state, action) => {
    const { maxIndex } = action;
    const { browseIndex } = state;
    const newIndex = browseIndex >= maxIndex ? 0 : browseIndex + 1;
    if (newIndex === 0) {
      alert(
        "That's everyone in the app. Please invite your friends to join! In the mean time, we'll start back from the beginning.",
      );
    }
    return { ...state, browseIndex: newIndex };
  }),
);
