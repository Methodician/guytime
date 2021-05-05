import { Injectable } from '@angular/core';
import { ActivationEnd, Router, UrlSegment } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, switchMap } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import {
  watchNavigation,
  watchNavigationFailure,
  watchNavigationSuccess,
} from './header.actions';

@Injectable()
export class HeaderEffects {
  wasBackJustClicked = false;
  previousUrls: string[] = [];
  currentUrl: string;
  defaultBackUrl: string;

  constructor(private actions$: Actions, private router: Router) {}

  watchNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(watchNavigation),
      switchMap(_ => this.router.events),
      filter(($e: any) => $e instanceof ActivationEnd),
      map(($e: ActivationEnd) => {
        const { snapshot } = $e;
        const { url, data } = snapshot;
        const { shouldShowBack } = data;

        const urlSegmentArrayToUrl = (segmentArray: UrlSegment[]) =>
          `/${segmentArray.map(segment => segment.path).join('/')}`;

        const targetUrl = urlSegmentArrayToUrl(url);
        url.pop();
        this.defaultBackUrl = urlSegmentArrayToUrl(url);

        if (!this.wasBackJustClicked) {
          if (!!this.currentUrl) {
            // If user did not just click back and there is a current URL stored, add that to breadcrumb trail before moving on
            this.previousUrls.push(this.currentUrl);
          }

          if (this.previousUrls.length > 25) {
            // If user did not just click back and there are too many breadcrumbs, trim it down to 25
            // (not sure this is needed but could help performance and improve UX by avoiding infinite backup tracking)
            this.previousUrls.shift();
          }
        }

        if (!shouldShowBack && this.previousUrls.length > 0) {
          // If there is no back option we can clear out the breadcrumb to make way for future navigations
          this.previousUrls = [];
        }

        // We wait until processing before switching current URL to the one we just navigated to
        this.currentUrl = targetUrl;
        // We also wait until processing before reverting wasBackJustClicked to false;
        this.wasBackJustClicked = false;

        if (!this.defaultBackUrl && shouldShowBack) {
          // This just seemed like a bug that could crop up later, so preventing it with custom error
          throw new Error(
            'Back can not be displayed without a default URL in the HeaderService. Set a defaultUrl first',
          );
        }

        return watchNavigationSuccess({ shouldShowBack });
      }),
      catchError(error => of(watchNavigationFailure({ error }))),
    ),
  );
}
