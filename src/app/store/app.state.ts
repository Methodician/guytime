import { UserI } from '@app/models/user';

export interface Fella {
  name: string;
  uid: string;
}
export interface TestFellasState {
  currentFellaIndex: number;
  fellas: Fella[];
  contactsIds: object;
}

export interface FellaState {
  currentFellaIndex: number;
  fellas: ReadonlyArray<UserI>;
}

export interface AppState {
  testFellasState: TestFellasState;
  fellaState: FellaState;
}
