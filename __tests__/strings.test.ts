import { tabLabels } from '@/src/constants/strings';

describe('tab labels', () => {
  it('defines the two main tabs', () => {
    expect(tabLabels).toEqual({
      expenses: 'Spese',
      summary: 'Riepilogo',
    });
  });
});