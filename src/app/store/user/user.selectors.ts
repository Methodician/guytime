import { KeyMapI } from '@app/models/shared';
import { ThumbnailOptionsT } from '@app/services/user.service';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authUid } from '../auth/auth.selectors';
import { userFeatureKey, UserStateT } from './user.reducer';

export const userState = createFeatureSelector<UserStateT>(userFeatureKey);

export const loggedInUser = createSelector(
  userState,
  authUid,
  (users, authUid) => users.find(user => user.uid === authUid),
);

// for performance reasons, we may ultimately replace the users array in store with a KeyMap
export const specificUser = (uid: string) =>
  createSelector(userState, state => state.find(user => user.uid === uid));

export const otherUsers = createSelector(userState, authUid, (users, authUid) =>
  users.filter(user => user.uid !== authUid),
);

export const userContactMap = (uid: string) =>
  createSelector(specificUser(uid), user => user?.contacts);

export const userListByIdMap = (idMap: KeyMapI<boolean>) =>
  createSelector(userState, authUid, (users, authUid) =>
    users.filter(user => !!idMap[user.uid] && user.uid !== authUid),
  );

export const avatarFileName = (uid: string, size: ThumbnailOptionsT) =>
  createSelector(
    specificUser(uid),
    user => user?.uploadedProfileImageMap?.[size]?.fileName,
  );
