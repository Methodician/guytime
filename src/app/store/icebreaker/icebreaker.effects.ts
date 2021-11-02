import { Injectable }                             from '@angular/core';
import { IcebreakerService }                      from '@app/services/icebreaker.service';
import { Actions, createEffect, ofType }          from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import {
  loadIcebreakers,
  loadIcebreakersSuccess,
  loadIcebreakersFailure,
  loadIcebreakerAnswerForUserId,
  loadIcebreakerAnswerForUserIdSuccess,
  loadIcebreakerAnswerForUserIdFailure,
} from './icebreaker.actions';
import { of }                                     from 'rxjs';

@Injectable()
export class IcebreakerEffects {
  constructor(private actions$: Actions, private icebreakerSvc: IcebreakerService) {}

  loadIcebreakers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadIcebreakers),
      exhaustMap(_ =>
        this.icebreakerSvc
          .icebreakersRef()
          .valueChanges({ idField: 'id' })
          .pipe(map(icebreakers => loadIcebreakersSuccess({ icebreakers }))),
      ),
    ),
  );

  loadIcebreakerAnswerForUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadIcebreakerAnswerForUserId),
      switchMap(async (action) => {
        return await this.icebreakerSvc.icebreakerAnswerForUserId(action.userId);
      }),
      map(icebreakerAnswer => loadIcebreakerAnswerForUserIdSuccess({ icebreakerAnswer })),
      catchError(error => of(loadIcebreakerAnswerForUserIdFailure({ error }))),
    ),
  );
}
