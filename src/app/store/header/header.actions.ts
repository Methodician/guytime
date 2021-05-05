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

export const backButtonClicked = createAction('[Header] Back Button Clicked');
export const backClickSuccess = createAction('[Header] Processed back click');
export const backClickFailure = createAction(
  '[Header] Failed to process back click... Weird.',
  props<{ error: any }>(),
);
