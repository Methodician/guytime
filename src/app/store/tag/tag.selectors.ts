import { KeyMapI } from '@app/models/shared';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { tagFeatureKey, TagStateI } from './tag.reducer';

export const tagState = createFeatureSelector<TagStateI>(tagFeatureKey);


// for performance reasons, we may ultimately replace the tags array in store with a KeyMap
export const specificTag = (id: string) =>
  createSelector(tagState, state => state.tags.find(tag => tag.id === id));


export const tagsForUser = createSelector(tagState, state => state.tagsForUser);
