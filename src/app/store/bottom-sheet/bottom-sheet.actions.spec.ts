import * as fromBottomSheet from './bottom-sheet.actions';

describe('loadHeaders', () => {
  it('should return an action', () => {
    expect(fromBottomSheet.openBottomSheet().type).toBe('[Bottom Sheet] Open');
  });
});
