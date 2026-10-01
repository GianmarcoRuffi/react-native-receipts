import { monthRange, toIsoDate } from './dates';

describe('toIsoDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toIsoDate(new Date(2026, 8, 30))).toBe('2026-09-30');
  });
});

describe('monthRange', () => {
  it('returns the full range for a regular month', () => {
    expect(monthRange('2026-09')).toEqual({ from: '2026-09-01', to: '2026-09-30' });
  });

  it('handles leap years', () => {
    expect(monthRange('2024-02')).toEqual({ from: '2024-02-01', to: '2024-02-29' });
  });

  it('rejects malformed months', () => {
    expect(() => monthRange('2026-13')).toThrow();
    expect(() => monthRange('2026-2')).toThrow();
  });
});