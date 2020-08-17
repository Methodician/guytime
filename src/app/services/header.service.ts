import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  headerOptions$: BehaviorSubject<HeaderOptionMapT> = new BehaviorSubject(
    new Map(),
  );
  headerOptions: HeaderOptionMapT = new Map();

  XAction: () => void = null;

  headerText$ = new BehaviorSubject('Guy Time');

  constructor() {}

  setHeaderOption = (name: string, option: HeaderOptionI) => {
    this.headerOptions.set(name, option);
    this.headerOptions$.next(this.headerOptions);
  };

  disableHeaderOption = (name: string) => {
    const existingOption = this.headerOptions.get(name);
    const newOption = { ...existingOption, isDisabled: true };
    this.headerOptions$.next(this.headerOptions);
    this.headerOptions.set(name, newOption);
  };

  enableHeaderOption = (name: string) => {
    const existingOption = this.headerOptions.get(name);
    const newOption = { ...existingOption, isDisabled: false };
    this.headerOptions.set(name, newOption);
    this.headerOptions$.next(this.headerOptions);
  };

  removeHeaderOption = (name: string) => {
    this.headerOptions.delete(name);
    this.headerOptions$.next(this.headerOptions);
  };

  clearHeaderOptions = () => {
    this.headerOptions.clear();
    this.headerOptions$.next(this.headerOptions);
  };

  setXAction = (action: () => void) => (this.XAction = action);

  setHeaderText = (text: string) => this.headerText$.next(text);

  resetHeader = () => {
    this.clearHeaderOptions();
    this.setHeaderText('Guy Time');
    this.setXAction(null);
  };
}

export type HeaderOptionMapT = Map<string, HeaderOptionI>;

export interface HeaderOptionI {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}
