import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  headerOptions: HeaderOptionMapT = new Map();

  XAction: () => void = null;

  constructor() {}

  setHeaderOption = (name: string, option: HeaderOptionI) =>
    this.headerOptions.set(name, option);

  disableHeaderOption = (name: string) => {
    const existingOption = this.headerOptions.get(name);
    const newOption = { ...existingOption, isDisabled: true };
    this.headerOptions.set(name, newOption);
  };

  enableHeaderOption = (name: string) => {
    const existingOption = this.headerOptions.get(name);
    const newOption = { ...existingOption, isDisabled: false };
    this.headerOptions.set(name, newOption);
  };

  removeHeaderOption = (name: string) => this.headerOptions.delete(name);

  getHeaderOptions = () => this.headerOptions;

  clearHeaderOptions = () => this.headerOptions.clear();

  setXAction = (action: () => void) => (this.XAction = action);
}

export type HeaderOptionMapT = Map<string, HeaderOptionI>;

export interface HeaderOptionI {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}
