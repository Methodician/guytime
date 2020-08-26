import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  headerOptions$: BehaviorSubject<HeaderOptionMapT> = new BehaviorSubject(
    new Map(),
  );
  headerOptions: HeaderOptionMapT = new Map();

  shouldShowX$ = new BehaviorSubject(false);

  headerText$ = new BehaviorSubject('Guy Time');

  wasXJustClicked = false;
  previousUrls = [];
  currentUrl = null;
  defaultUrl = null;

  constructor(private router: Router) {
    this.watchNavigation();
  }

  watchNavigation = () => {
    this.router.events
      .pipe(filter(($e: any) => $e instanceof NavigationEnd))
      .subscribe($e => {
        if (!this.wasXJustClicked) {
          this.currentUrl && this.previousUrls.push(this.currentUrl);
          this.previousUrls.length > 10 && this.previousUrls.shift();
          this.currentUrl = $e.url;
        }
        this.wasXJustClicked = false;
      });
  };

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

  setDefaultXUrl = (url: string) => {
    this.defaultUrl = url;
    this.setShouldShowX(true);
  };

  setShouldShowX = (shouldShowX: boolean) => {
    if (!this.defaultUrl && shouldShowX) {
      throw new Error(
        'X can not be displayed without a default URL in the HeaderService. Set a defaultUrl first',
      );
    }
    this.shouldShowX$.next(shouldShowX);
  };

  onXClicked = () => {
    this.wasXJustClicked = true;
    if (this.previousUrls.length > 0) {
      const lastUrl = this.previousUrls.pop();
      this.router.navigateByUrl(lastUrl);
    } else if (this.defaultUrl) {
      this.router.navigateByUrl(this.defaultUrl);
    } else {
      throw new Error(
        'X can not be displayed without a default URL in the HeaderService',
      );
    }
  };

  setHeaderText = (text: string) => this.headerText$.next(text);

  resetHeader = () => {
    this.clearHeaderOptions();
    this.setHeaderText('Guy Time');
    this.setShouldShowX(false);
    this.defaultUrl = null;
  };
}

export type HeaderOptionMapT = Map<string, HeaderOptionI>;

export interface HeaderOptionI {
  iconName: string;
  optionText: string;
  isDisabled: boolean;
  onClick: Function;
}
