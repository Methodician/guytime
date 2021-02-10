import { UserI } from '@app/models/user';
import { createSelector } from '@ngrx/store';

import { AppState } from './app.state';

export const selectLoggedinUser = createSelector(
  (state: AppState) => state.userState.currentUser,
  user => user,
);

// export const selectLoggedinUserContacts = createSelector(
//   selectLoggedinUser,
//   (user: UserI) => {
//     const { contacts } = user;
//     if (!contacts) return [];
//     const contactIds = Object.keys(contacts);
//     return contactIds;
//   },
// );

// export const selectFellas = createSelector(
//   (state: AppState) => state.testFellasState.fellas,
//   fellas => fellas,
// );

// export const selectContactIds = createSelector(
//   (state: AppState) => state.testFellasState.contactsIds,
//   contactIds => contactIds,
// );

// export const selectCurrentFellaIndex = createSelector(
//   (state: AppState) => state.testFellasState.currentFellaIndex,
//   currentFellaIndex => currentFellaIndex,
// );

// export const selectCurrentFella = createSelector(
//   selectFellas,
//   selectCurrentFellaIndex,
//   (fellas, currentFellaIndex) => fellas[currentFellaIndex],
// );
