import { Injectable } from '@angular/core';
import { ActivationEnd, Router, UrlSegment } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, filter, map, switchMap } from 'rxjs/operators';
import { watchNavigation, watchNavigationSuccess } from './header.actions';

@Injectable()
export class HeaderEffects {
  wasBackJustClicked = false;

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

        // const urlSegmentArrayToUrl = (segmentArray: UrlSegment[]) =>
        //   `/${segmentArray.map(segment => segment.path).join('/')}`;

        // const targetUrl = urlSegmentArrayToUrl(url);
        // url.pop();
        // const defaultBackUrl = urlSegmentArrayToUrl(url);

        // check if back was just clicked and whether a current URL exists and how many previous URLs there are and set prev urls based on variables?
        // check if shouldShowBack then maybe eliminate previous URLs array?
        // update currentUrl and set wasBackJustClicked to false?
        // update shouldShowBack with special function?

        return watchNavigationSuccess({ url, shouldShowBack });
      }),
    ),
  );
}
