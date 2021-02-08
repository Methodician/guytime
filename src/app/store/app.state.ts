export interface FellasState {
  currentFellaIndex: number;
  fellas: object[];
  contactsIds: object;
}

export interface AppState {
  fellasState: FellasState;
}
