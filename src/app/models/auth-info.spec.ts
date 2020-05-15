import { AuthInfo } from './auth-info';

describe('AuthInfo', () => {
  it('should create an instance', () => {
    expect(new AuthInfo(null, false, null, null)).toBeTruthy();
  });
});
