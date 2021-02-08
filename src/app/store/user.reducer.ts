import { createReducer, on } from '@ngrx/store';
import { FellasState } from './app.state';

import * as UserActions from './user.actions';
// import { UserI } from '../models/user';

// NgRx Docs
const { nextFella, addFella } = UserActions;

export const initialState: FellasState = {
  currentFellaIndex: 0,
  fellas: [
    { name: 'joe', uid: 'asf3' },
    { name: 'jake', uid: '4sf3' },
    { name: 'ingo', uid: 'as3' },
    { name: 'sam', uid: '3sf3' },
  ],
  contactsIds: {},
};

export const userReducer = createReducer(
  initialState,
  on(nextFella, state => {
    const { currentFellaIndex, fellas } = state;
    if (currentFellaIndex < fellas.length - 1) {
      const newIndex = currentFellaIndex + 1;
      return { ...state, currentFellaIndex: newIndex };
    } else {
      alert("That's all folks, starting over");
      return { ...state, currentFellaIndex: 0 };
    }
  }),
  on(addFella, state => {
    const { contactsIds, currentFellaIndex, fellas } = state;
    const currentFella = fellas[currentFellaIndex];
    const { uid } = currentFella as any;
    const newContactIds = { ...contactsIds, [uid]: true };
    return { ...state, contactsIds: newContactIds };
  }),
);
