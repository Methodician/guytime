import { createReducer, on } from '@ngrx/store';
import { nextFellaSuccess, previousFellaSuccess, } from './browse.actions';

export const browseFeatureKey = 'browse';

export interface BrowseStateI {
  browseIndex: number;
}

export const initialState: BrowseStateI = {
  browseIndex: 0,
};

export const browseReducer = createReducer(
  initialState,
  on(nextFellaSuccess, (state, action) => {
    const { newIndex } = action;
    return { ...state, browseIndex: newIndex };
  }),
  on(previousFellaSuccess, (state, action) => {
    const {newIndex} = action;
    return {...state, browseIndex: newIndex};
  }),
);
