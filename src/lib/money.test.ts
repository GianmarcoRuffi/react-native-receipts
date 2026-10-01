import { formatCents, formatCentsForInput, parseEuroToCents } from './money';

describe('parseEuroToCents', () => {
  it('accepts comma and point decimals', () => {
    expect(parseEuroToCents('12,50')).toBe(1250);
    expect(parseEuroToCents('12.5')).toBe(1250);
  });

  it.each(['', '0', '-1', '1.234', '1,2.3', 'abc'])('rejects %j', (value) => {
    expect(() => parseEuroToCents(value)).toThrow();
  });
});

describe('formatCents', () => {
  it('formats euros with two decimal places', () => {
    expect(formatCents(1250)).toBe('12,50 €');
  });
});

describe('formatCentsForInput', () => {
  it('formats cents as an editable decimal amount without a currency suffix', () => {
    expect(formatCentsForInput(1250)).toBe('12,50');
    expect(formatCentsForInput(5)).toBe('0,05');
  });
});