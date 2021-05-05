import { UrlSegment } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export const watchNavigation = createAction('[Header] Watch Navigation');

export const watchNavigationSuccess = createAction(
  '[Header] Watch Navigation Success',
  props<{ shouldShowBack: boolean }>(),
);

export const watchNavigationFailure = createAction(
  '[Header] Watch Navigation Failure',
  props<{ error: any }>(),
);
