import {
  authFeatureKey,
  authReducer,
  AuthStateT,
} from '@app/store/auth/auth.reducer';
import {
  userFeatureKey,
  userReducer,
  UserStateT,
} from '@app/store/user/user.reducer';
import { ActionReducerMap, MetaReducer, Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface StateI {
  auth: AuthStateT;
  users: UserStateT;
}

export const reducers: ActionReducerMap<StateI> = {
  [authFeatureKey]: authReducer,
  [userFeatureKey]: userReducer,
};

export const metaReducers: MetaReducer<StateI>[] = !environment.production
  ? []
  : [];

// NgRx Helpers - do these belong elsewhere?

export const selectPromise = (store: Store, selector: Selector<any, any>) =>
  store.select(selector).pipe(take(1)).toPromise();
