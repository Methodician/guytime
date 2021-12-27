import {
  authFeatureKey,
  authReducer,
  AuthStateI,
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
import { tagFeatureKey, tagReducer, TagStateI, } from './tag/tag.reducer';
import {
  headerFeatureKey,
  headerReducer,
  HeaderStateI,
}                                                from './header/header.reducer';
import {
  icebreakerFeatureKey,
  icebreakerReducer,
  IcebreakerStateI,
}                                                   from './icebreaker/icebreaker.reducer';
import {
  bottomSheetFeatureKey,
  bottomSheetReducer,
  BottomSheetStateI,
} from '@app/store/bottom-sheet/bottom-sheet.reducer';

export interface StateI {
  [authFeatureKey]: AuthStateI;
  [userFeatureKey]: UserStateT;
  [browseFeatureKey]: BrowseStateI;
  [chatFeatureKey]: ChatStateI;
  [headerFeatureKey]: HeaderStateI;
  [tagFeatureKey]: TagStateI;
  [icebreakerFeatureKey]: IcebreakerStateI;
  [bottomSheetFeatureKey]: BottomSheetStateI;
}

export const reducers: ActionReducerMap<StateI> = {
  [authFeatureKey]: authReducer,
  [userFeatureKey]: userReducer,
  [browseFeatureKey]: browseReducer,
  [chatFeatureKey]: chatReducer,
  [headerFeatureKey]: headerReducer,
  [tagFeatureKey]: tagReducer,
  [icebreakerFeatureKey]: icebreakerReducer,
  [bottomSheetFeatureKey]: bottomSheetReducer,
};

export const metaReducers: MetaReducer<StateI>[] = !environment.production
  ? []
  : [];
