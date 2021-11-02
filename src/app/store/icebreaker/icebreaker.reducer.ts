import { IcebreakerAnswerI, IcebreakerI } from '@app/models/icebreaker';
import { createReducer, on }                                                                from '@ngrx/store';
import { loadIcebreakersSuccess, loadIcebreakerAnswerForUserIdSuccess, } from './icebreaker.actions';

export const icebreakerFeatureKey = 'icebreakers';

export interface IcebreakerStateI {
  icebreakers: IcebreakerI[];
  icebreakerAnswerForUser: IcebreakerAnswerI;
}

export const initialState: IcebreakerStateI = {
  icebreakers: [],
  icebreakerAnswerForUser: null,
};

export const icebreakerReducer = createReducer(
  initialState,
  on(loadIcebreakersSuccess, (state, {icebreakers}) => ({
    ...state,
    icebreakers,
  })),
  on(loadIcebreakerAnswerForUserIdSuccess, ( state, { icebreakerAnswer } ) => ({
    ...state,
    icebreakerAnswerForUser: icebreakerAnswer,
  })),
);
