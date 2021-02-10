import { UserI } from '@app/models/user';

export interface Fella {
  name: string;
  uid: string;
}
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
}
