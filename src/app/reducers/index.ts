import {
  authFeatureKey,
  authReducer,
  AuthStateI,
} from '@app/store/auth/auth.reducer';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Selector,
  Store,
} from '@ngrx/store';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface StateI {
  auth: AuthStateI;
}

export const reducers: ActionReducerMap<StateI> = {
  [authFeatureKey]: authReducer,
};

export const metaReducers: MetaReducer<StateI>[] = !environment.production
  ? []
  : [];

// NgRx Helpers - do these belong elsewhere?

export const selectPromise = (store: Store, selector: Selector<any, any>) =>
  store.select(selector).pipe(take(1)).toPromise();
