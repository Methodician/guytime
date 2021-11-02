import { TagI, }                                   from '@app/models/tag';
import { createReducer, on }                       from '@ngrx/store';
import { loadTagsSuccess, loadTagsForUserSuccess } from './tag.actions';

export const tagFeatureKey = 'tags';

export interface TagStateI {
  tags: TagI[];
  tagsForUser: TagI[];
}

export const initialState: TagStateI = {
  tags: [],
  tagsForUser: [],
};

export const tagReducer = createReducer(
  initialState,
  on(loadTagsSuccess, (state, {tags}) => ({
    ...state,
    tags,
  })),
  on(loadTagsForUserSuccess, ( state, { tagsForUser } ) => ({
    ...state,
    tagsForUser,
  })),
);
