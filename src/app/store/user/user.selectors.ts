import { state } from '@angular/animations';
import { StateI } from '@app/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const getLoggedInUser = (state: StateI) =>
  state.users.find(user => user.uid === state.auth.uid);

export const loggedInUser = createSelector(
  (state: StateI) => getLoggedInUser(state),
  user => user,
);

export const fellasToBrowse = createSelector(
  (state: StateI) => {
    const loggedInUser = getLoggedInUser(state);

    if (!loggedInUser) return;

    const loggedInUid = state.auth.uid;
    const otherUsers = state.users.filter(user => user.uid !== loggedInUid);
    if (!!loggedInUser.contacts)
      return otherUsers.filter(user => !loggedInUser.contacts[user.uid]);
    return otherUsers;
  },
  users => users,
);

export const userContacts = createSelector(
  (state: StateI, uid: string) => state.users[uid]?.contacts,
  contacts => contacts,
  contacts => contacts,
);

export const loggedInUserContacts = createSelector(
  (state: StateI) =>
    state.users.filter(user => getLoggedInUser(state).contacts?.[user.uid]),
  users => users,
);
