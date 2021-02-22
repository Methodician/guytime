import { Action, createReducer, on } from '@ngrx/store';
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
  on(nextFella, (state, _) => ({
    ...state,
    browseIndex: state.browseIndex + 1,
  })),
);
