import { KeyMapI } from '@app/models/shared';
import { StateI } from '@app/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userFeatureKey, UserStateT } from './user.reducer';

export const userState = createFeatureSelector<UserStateT>(userFeatureKey);

export const loggedInUser = createSelector(
  (state: StateI) => state.users.find(user => user.uid === state.auth.uid),
  user => user,
);

export const specificUser = (uid: string) =>
  createSelector(userState, state => state.find(user => user.uid === uid));

export const otherUsers = createSelector(
  (state: StateI) => state.users.filter(user => user.uid !== state.auth.uid),
  users => users,
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

export const userContacts = (uid: string) =>
  createSelector(specificUser(uid), user => user?.contacts);

export const userListByIds = createSelector(
  (state: StateI, uidMap: KeyMapI<boolean>) =>
    state.users.filter(
      user => !!uidMap[user.uid] && !(state.auth.uid === user.uid),
    ),
  users => users,
);
