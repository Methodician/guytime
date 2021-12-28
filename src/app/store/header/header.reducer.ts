import { HeaderOptionI } from '@app/models/ui';
import { createReducer, on } from '@ngrx/store';
import {
  addHeaderOptionsSuccess,
  resetHeader,
  setHeaderText,
  watchNavigationSuccess,
} from './header.actions';

export const headerFeatureKey = 'header';

export interface HeaderStateI {
  shouldShowBack: boolean;
  shouldHide: boolean;
  headerText: string;
  headerOptions: Map<string, HeaderOptionI>;
}

export const initialState: HeaderStateI = {
  shouldShowBack: false,
  shouldHide: false,
  headerText: 'Fellas',
  headerOptions: new Map(),
};

export const headerReducer = createReducer(
  initialState,
  on(watchNavigationSuccess, (state, { shouldShowBack, shouldHide }) => ({
    ...state,
    shouldShowBack,
    shouldHide,
  })),
  on(setHeaderText, (state, { headerText }) => ({
    ...state,
    headerText,
  })),
  on(addHeaderOptionsSuccess, (state, { options }) => ({
    ...state,
    headerOptions: options,
  })),
  on(resetHeader, () => initialState),
);
