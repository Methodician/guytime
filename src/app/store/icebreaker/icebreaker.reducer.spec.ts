import { icebreakerReducer, initialState } from './icebreaker.reducer';

describe('Icebreaker Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = icebreakerReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
