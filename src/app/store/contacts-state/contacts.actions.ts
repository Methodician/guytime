import { KeyMapI } from '@app/models/shared';
import { UserI } from '@app/models/user';
import { createAction, props } from '@ngrx/store';

export const LOAD_USER_CONTACTS = '[User] Load User Contacts';
export const USER_CONTACTS_LOADED = '[User] Contacts Loaded';

export const loadUserContacts = createAction(
  LOAD_USER_CONTACTS,
  props<{ user: UserI }>(),
);

export const userContactsLoaded = createAction(
  USER_CONTACTS_LOADED,
  props<{ contacts: KeyMapI<UserI> }>(),
);
