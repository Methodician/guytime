import * as fromAuth from './auth.actions';

describe('loadAuths', () => {
  it('should return an action', () => {
    expect(fromAuth.loadAuths().type).toBe('[Auth] Load Auths');
  });
});
