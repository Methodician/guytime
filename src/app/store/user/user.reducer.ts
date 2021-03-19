import { UserI } from '@app/models/user';
import { createReducer, on } from '@ngrx/store';
import { loadUsersSuccess } from './user.actions';

export const userFeatureKey = 'users';

export type UserStateT = ReadonlyArray<UserI>;

export const initialState: UserStateT = [];

export const userReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (_, action) => action.users),
);
