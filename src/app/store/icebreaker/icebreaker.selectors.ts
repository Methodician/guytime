import { createFeatureSelector, createSelector }      from '@ngrx/store';
import { IcebreakerStateI, icebreakerFeatureKey, } from './icebreaker.reducer';

export const icebreakerState = createFeatureSelector<IcebreakerStateI>(icebreakerFeatureKey);

export const icebreakers = createSelector(icebreakerState, state => state.icebreakers);

export const icebreakerAnswerForUser = createSelector(icebreakerState, state => state.icebreakerAnswerForUser);
