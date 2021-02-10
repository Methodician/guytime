import { UserI } from '@app/models/user';
import { createReducer, on } from '@ngrx/store';
import { UserState } from './app.state';

import { currentUserLoaded, userAuthenticated } from './user.actions';

const NULL_USER: UserI = {
  fName: null,
  lName: null,
  age: null,
  relationshipStatus: 'UNSPECIFIED',
  bio: null,
  activityTypes: [],
  connectionIds: [],
};
const initialState: UserState = { currentUser: NULL_USER };

export const userReducer = createReducer(
  initialState,
  on(currentUserLoaded, (state, action) => {
    return { ...state, currentUser: action.user };
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
