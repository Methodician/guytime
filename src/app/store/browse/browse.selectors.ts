import { createFeatureSelector, createSelector } from '@ngrx/store';
import { browseFeatureKey, BrowseStateI } from './browse.reducer';
import { loggedInUser, otherUsers } from '../user/user.selectors';

export const browseState = createFeatureSelector<BrowseStateI>(
  browseFeatureKey,
);

export const fellasToBrowse = createSelector(
  loggedInUser,
  otherUsers,
  (loggedInUser, otherUsers) => {
    const { contacts } = loggedInUser || {};
    if (!contacts) {
      return otherUsers;
    }
    return otherUsers.filter(user => !contacts[user.uid]);
  },
);

export const browseIndex = createSelector(
  browseState,
  state => state.browseIndex,
);

export const maxBrowseIndex = createSelector(
  fellasToBrowse,
  fellas => fellas.length - 1,
);

export const selectedFella = createSelector(
  browseIndex,
  fellasToBrowse,
  (index, fellas) => fellas[index],
);
