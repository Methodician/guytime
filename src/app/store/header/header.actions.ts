import { HeaderOptionI } from '@app/models/ui';
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

export const setHeaderText = createAction(
  '[Header] Set Header Text',
  props<{ headerText: string }>(),
);

export const resetHeader = createAction('[Header] Reset Header');

// addHeaderOptions action adds an array of one or more options to header
export const addHeaderOptions = createAction(
  '[Header] Add Some Options',
  props<{
    optionsToAdd: Map<string, HeaderOptionI>;
  }>(),
);

// addHeaderOptionSuccess action
export const addHeaderOptionsSuccess = createAction(
  '[Header] Successfully added header options',
  props<{ options: Map<string, HeaderOptionI> }>(),
);

// addHeaderOptionsFail action
export const addHeaderOptionsFail = createAction(
  '[Header] Failed to add options',
  props<{ error: any }>(),
);

// removeHeaderOption action
export const removeHeaderOption = createAction(
  '[Header] Remove and Option',
  props<{ name: string }>(),
);

// // clearHeaderOptions action
// export const clearHeaderOptions = createAction('[Header] Clear All Options');

// disableHeaderOption action
export const disableHeaderOption = createAction(
  '[Header] Disable an Option',
  props<{ name: string }>(),
);

// enableHeaderOption action
export const enableHeaderOption = createAction(
  '[Header] Enable an Option',
  props<{ name: string }>(),
);
