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
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import {
  browseFeatureKey,
  browseReducer,
  BrowseStateI,
} from './browse/browse.reducer';
import { chatFeatureKey, chatReducer, ChatStateI } from './chat/chat.reducer';

export interface StateI {
  [authFeatureKey]: AuthStateT;
  [userFeatureKey]: UserStateT;
  [browseFeatureKey]: BrowseStateI;
  [chatFeatureKey]: ChatStateI;
}

export const reducers: ActionReducerMap<StateI> = {
  [authFeatureKey]: authReducer,
  [userFeatureKey]: userReducer,
  [browseFeatureKey]: browseReducer,
  [chatFeatureKey]: chatReducer,
};

export const metaReducers: MetaReducer<StateI>[] = !environment.production
  ? []
  : [];
