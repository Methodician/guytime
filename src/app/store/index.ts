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
import {
  browseFeatureKey,
  browseReducer,
  BrowseStateI,
} from './browse/browse.reducer';

export interface StateI {
  auth: AuthStateT;
  users: UserStateT;
  browse: BrowseStateI;
}

export const reducers: ActionReducerMap<StateI> = {
  [authFeatureKey]: authReducer,
  [userFeatureKey]: userReducer,
  [browseFeatureKey]: browseReducer,
};

export const metaReducers: MetaReducer<StateI>[] = !environment.production
  ? []
  : [];
