import { KeyMapI } from '@app/models/shared';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authUid } from '../auth/auth.selectors';
import { userFeatureKey, UserStateT } from './user.reducer';

export const userState = createFeatureSelector<UserStateT>(userFeatureKey);

export const loggedInUser = createSelector(
  userState,
  authUid,
  (users, authUid) => users.find(user => user.uid === authUid),
);

export const specificUser = (uid: string) =>
  createSelector(userState, state => state.find(user => user.uid === uid));

export const otherUsers = createSelector(userState, authUid, (users, authUid) =>
  users.filter(user => user.uid !== authUid),
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

export const userContactMap = (uid: string) =>
  createSelector(specificUser(uid), user => user?.contacts);

export const userListByIdMap = (idMap: KeyMapI<boolean>) =>
  createSelector(userState, authUid, (users, authUid) =>
    users.filter(user => !!idMap[user.uid] && user.uid !== authUid),
  );
