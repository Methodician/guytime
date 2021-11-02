import { tagReducer, initialState } from './tag.reducer';

describe('Tag Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = tagReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
