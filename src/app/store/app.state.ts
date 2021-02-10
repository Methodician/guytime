import { KeyMapI } from '@app/models/shared';
import { UserI } from '@app/models/user';

export interface FellaState {
  currentFellaIndex: number;
  fellas: ReadonlyArray<UserI>;
}

export interface UserState {
  currentUser: UserI;
}

export interface AppState {
  fellaState: FellaState;
  userState: UserState;
  contactsState: KeyMapI<UserI[]>;
}
