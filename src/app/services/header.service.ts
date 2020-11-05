import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivationEnd, UrlSegment } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  headerOptions$: BehaviorSubject<HeaderOptionMapT> = new BehaviorSubject(
    new Map(),
  );
  headerOptions: HeaderOptionMapT = new Map();

  shouldShowBack$ = new BehaviorSubject(false);
  shouldShowBack = false;
  defaultBackUrl: string;

  headerText$ = new BehaviorSubject('Guy Time');

  wasBackJustClicked = false;
  previousUrls = [];
  currentUrl = null;
  defaultUrl = null;

  constructor(private router: Router) {
    this.watchNavigation();
  }

  watchNavigation = () => {
    this.router.events
      .pipe(filter(($e: any) => $e instanceof ActivationEnd))
      .subscribe($e => {
        if ($e instanceof ActivationEnd) {
          // Checking instance type here for future expandability plus safe typing
          const { snapshot } = $e;
          const { url, data } = snapshot;
          const { shouldShowBack } = data;

          this.shouldShowBack = shouldShowBack;

          const urlSegmentArrayToUrl = (segmentArray: UrlSegment[]) =>
            `/${segmentArray.map(segment => segment.path).join('/')}`;

          const targetUrl = urlSegmentArrayToUrl(url);
          url.pop();
          const defaultBackUrl = urlSegmentArrayToUrl(url);
          this.defaultBackUrl = defaultBackUrl;
          this.defaultUrl = defaultBackUrl;

          if (!this.wasBackJustClicked) {
            if (!!this.currentUrl) {
              this.previousUrls.push(this.currentUrl);
            }
            if (this.previousUrls.length > 25) {
              this.previousUrls.shift();
            }
          }

          if (!shouldShowBack && this.previousUrls.length > 0) {
            this.previousUrls = [];
          }

          this.currentUrl = targetUrl;
          this.wasBackJustClicked = false;

          this.updateShouldShowBack();
        }
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

  updateShouldShowBack = () => {
    const { defaultUrl, shouldShowBack } = this;
    if (!defaultUrl && shouldShowBack) {
      throw new Error(
        'Back can not be displayed without a default URL in the HeaderService. Set a defaultUrl first',
      );
    }
    this.shouldShowBack$.next(shouldShowBack);
  };

  onBackClicked = () => {
    this.wasBackJustClicked = true;
    if (this.previousUrls.length > 0) {
      const lastUrl = this.previousUrls.pop();
      this.router.navigateByUrl(lastUrl);
    } else if (this.defaultUrl) {
      this.router.navigateByUrl(this.defaultUrl);
    } else {
      throw new Error(
        'Back can not be displayed without a default URL in the HeaderService',
      );
    }
  };

  setHeaderText = (text: string) => this.headerText$.next(text);

  resetHeader = () => {
    this.clearHeaderOptions();
    this.setHeaderText('Guy Time');
    this.shouldShowBack = false;
    this.updateShouldShowBack();
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
