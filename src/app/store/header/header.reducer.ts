import { Action, createReducer, on } from '@ngrx/store';

export const headerFeatureKey = 'header';

export interface HeaderOptionI {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}

export interface HeaderStateI {
  shouldShowBack: boolean;
  defaultBackUrl: string;
  headerText: string;
  previousUrls: ReadonlyArray<string>;
  currentUrl: string;
  defaultUrl: string;
  headerOptions: Map<string, HeaderOptionI>;
}

export const initialState: HeaderStateI = {
  shouldShowBack: false,
  defaultBackUrl: null,
  headerText: 'Fellas',
  previousUrls: [],
  currentUrl: null,
  defaultUrl: null,
  headerOptions: new Map(),
};

export const headerReducer = createReducer(initialState);
