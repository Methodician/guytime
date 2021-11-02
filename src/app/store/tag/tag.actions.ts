import { TagI }                from '@app/models/tag';
import { createAction, props } from '@ngrx/store';

export const loadTags = createAction('[Tag] Load Tags');

export const loadTagsSuccess = createAction(
  '[Tag] Load Tags Success',
  props<{ tags: TagI[] }>(),
);

export const loadTagsFailure = createAction(
  '[Tag] Load Tags Failure',
  props<{ error: any }>(),
);

export const loadTagsForUserId = createAction(
  '[Tag] Load Tags for UserId',
  props<{ userId: string }>(),
);

export const loadTagsForUserSuccess = createAction(
  '[Tag] Load Tags for User Success',
  props<{ tagsForUser: TagI[] }>(),
);

export const loadTagsForUserFailure = createAction(
  '[Tag] Load Tags for User Failure',
  props<{ error: any }>(),
);
