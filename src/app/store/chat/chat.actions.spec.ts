import * as fromChat from './chat.actions';

describe('loadChats', () => {
  it('should return an action', () => {
    expect(fromChat.loadChats().type).toBe('[Chat] Load Chats');
  });
});
