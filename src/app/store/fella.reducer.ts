import { createReducer, on } from '@ngrx/store';
import { FellaState } from './app.state';
import { fellasLoaded, fellasLoadFailed, nextFella } from './fella.actions';

const initialState: FellaState = {
  fellas: [],
  currentFellaIndex: 0,
};

export const fellaReducer = createReducer(
  initialState,
  on(fellasLoaded, (state, action) => {
    return { ...state, fellas: action.users };
  }),
  on(fellasLoadFailed, (state, action) => {
    console.log({ state, action });
    alert('failed to load fellas');
    return state;
  }),
  on(nextFella, state => {
    const { fellas, currentFellaIndex } = state;
    if (currentFellaIndex < fellas.length - 1) {
      const newIndex = currentFellaIndex + 1;
      return { ...state, currentFellaIndex: newIndex };
    } else {
      alert(
        "You've seen all the fellas in the system. Ask some friends to join! In the mean time, we'll start from the beginning.",
      );
      return { ...state, currentFellaIndex: 0 };
    }
  }),
);
