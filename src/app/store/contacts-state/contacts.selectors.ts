import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectUserContacts = createSelector(
  (state: AppState, props) => state.contactsState[props.uid],
  users => users,
);
