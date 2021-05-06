import { AuthEffects } from '@app/store/auth/auth.effects';
import { UserEffects } from './store/user/user.effects';
import { BrowseEffects } from './store/browse/browse.effects';
import { ChatEffects } from './store/chat/chat.effects';
import { HeaderEffects } from './store/header/header.effects';

export const allEffects = [
  AuthEffects,
  UserEffects,
  BrowseEffects,
  ChatEffects,
  HeaderEffects,
];
