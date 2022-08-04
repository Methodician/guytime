import { IcebreakerAnswerI, IcebreakerI } from '@app/models/icebreaker';
import { createAction, props }            from '@ngrx/store';

export const loadIcebreakers = createAction('[Icebreaker] Load Icebreakers');

export const loadIcebreakersSuccess = createAction(
  '[Icebreaker] Load Icebreakers Success',
  props<{ icebreakers: IcebreakerI[] }>(),
);

export const loadIcebreakersFailure = createAction(
  '[Icebreaker] Load Icebreakers Failure',
  props<{ error: any }>(),
);

export const loadIcebreakerAnswerForUserId = createAction(
  '[Icebreaker] Load IcebreakerAnswer for UserId',
  props<{ userId: string }>(),
);

export const loadIcebreakerAnswerForUserIdSuccess = createAction(
  '[Icebreaker] Load IcebreakerAnswer for User Success',
  props<{ icebreakerAnswer: IcebreakerAnswerI | null }>(),
);

export const loadIcebreakerAnswerForUserIdFailure = createAction(
  '[Icebreaker] Load IcebreakerAnswer for User Failure',
  props<{ error: any }>(),
);
