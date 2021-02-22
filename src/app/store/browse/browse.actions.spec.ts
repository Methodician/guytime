import * as fromBrowse from './browse.actions';

describe('loadBrowses', () => {
  it('should return an action', () => {
    expect(fromBrowse.loadBrowses().type).toBe('[Browse] Load Browses');
  });
});
