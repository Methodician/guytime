import { UrlSegment } from '@angular/router';
import { Action, createReducer, on } from '@ngrx/store';
import { watchNavigationSuccess } from './header.actions';

export const headerFeatureKey = 'header';

export interface HeaderOptionI {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}

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
);
