export interface Fella {
  name: string;
  uid: string;
}
export interface FellasState {
  currentFellaIndex: number;
  fellas: Fella[];
  contactsIds: object;
}

export interface AppState {
  fellasState: FellasState;
}
