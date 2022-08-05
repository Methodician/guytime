import { Injectable } from '@angular/core';
import { TagService } from '@app/services/tag.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  loadTags,
  loadTagsFailure,
  loadTagsForUserFailure,
  loadTagsForUserId,
  loadTagsForUserSuccess,
  loadTagsSuccess,
} from './tag.actions';
import { of } from 'rxjs';

@Injectable()
export class TagEffects {
  constructor(private actions$: Actions, private tagSvc: TagService) {}

  // loadTags$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(loadTags),
  //     map(tags => loadTagsSuccess({ tags })),
  //     catchError(error => of(loadTagsFailure({ error }))),
  //   ),
  // );

  loadTagsForUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTagsForUserId),
      switchMap(async (action) => {
        return await this.tagSvc.tagsForUserIdDocs(action.userId);
      }),
      map(tagsForUser => {
        return loadTagsForUserSuccess({ tagsForUser })
      }),
      catchError(error => of(loadTagsForUserFailure({ error }))),
    ),
  );
}
