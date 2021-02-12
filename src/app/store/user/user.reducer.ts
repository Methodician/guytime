import { UserI } from '@app/models/user';
import { Action, createReducer, on } from '@ngrx/store';

const NULL_USER: UserI = {
  fName: null,
  lName: null,
  age: null,
  relationshipStatus: 'UNSPECIFIED',
  bio: null,
  activityTypes: [],
  connectionIds: [],
};

export const userFeatureKey = 'user';

export interface UserStateI {
  users: ReadonlyArray<UserI>;
}

export const initialState: UserStateI = { users: [] };

export const reducer = createReducer(initialState);
