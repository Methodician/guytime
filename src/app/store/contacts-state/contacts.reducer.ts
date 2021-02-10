import { KeyMapI } from '@app/models/shared';
import { UserI } from '@app/models/user';
import { createReducer, on } from '@ngrx/store';
import { UserState } from '../app.state';

import { userContactsLoaded } from './contacts.actions';

const NULL_USER: UserI = {
  fName: null,
  lName: null,
  age: null,
  relationshipStatus: 'UNSPECIFIED',
  bio: null,
  activityTypes: [],
  connectionIds: [],
};
const initialState: KeyMapI<UserI[]> = {};

export const contactsReducer = createReducer(
  initialState,

  on(userContactsLoaded, (state, action) => {
    const { contacts } = action;
    console.log({ contacts, state });

    return Object.assign({}, state, contacts);
    return { ...state, ...contacts };
    // const { currentUser } = state;
    // const { contacts } = action;
    // console.log({ currentUser, contacts });

    // const updatedUser = Object.assign({}, currentUser, { contacts });
    // return { ...state, currentUser: updatedUser };
  }),
);

// Helper for state updates to be immutable
// const newObject = (state, newData) => {
//   return Object.assign({}, state, newData);
// };

// NgRx Docs
// const { nextFella, addFella } = UserActions;

// export const initialState: UserState = {
//   currentFellaIndex: 0,
//   fellas: [
//     { name: 'joe', uid: 'asf3' },
//     { name: 'jake', uid: '4sf3' },
//     { name: 'ingo', uid: 'as3' },
//     { name: 'sam', uid: '3sf3' },
//   ],
//   contactsIds: {},
// };

// export const userReducer = createReducer(
//   initialState,
//   on(nextFella, state => {
//     const { currentFellaIndex, fellas } = state;
//     if (currentFellaIndex < fellas.length - 1) {
//       const newIndex = currentFellaIndex + 1;
//       return { ...state, currentFellaIndex: newIndex };
//     } else {
//       alert("That's all folks, starting over");
//       return { ...state, currentFellaIndex: 0 };
//     }
//   }),
//   on(addFella, (state, { uid }) => {
//     const { contactsIds } = state;
//     const newContactIds = { ...contactsIds, [uid]: true };
//     return { ...state, contactsIds: newContactIds };
//   }),
// );
