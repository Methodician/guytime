import { HeaderOptionI } from '@app/models/ui';
import { Action, createReducer, on } from '@ngrx/store';
import {
  addHeaderOptionsSuccess,
  resetHeader,
  setHeaderText,
  watchNavigationSuccess,
} from './header.actions';

export const headerFeatureKey = 'header';

export interface HeaderStateI {
  shouldShowBack: boolean;
  // defaultBackUrl: string;
  headerText: string;
  // previousUrls: ReadonlyArray<string>;
  // currentUrl: string;
  // defaultUrl: string;
  headerOptions: Map<string, HeaderOptionI>;
}

export const initialState: HeaderStateI = {
  shouldShowBack: false,
  headerText: 'Fellas',
  headerOptions: new Map(),
};

export const headerReducer = createReducer(
  initialState,
  on(watchNavigationSuccess, (state, { shouldShowBack }) => ({
    ...state,
    shouldShowBack,
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
