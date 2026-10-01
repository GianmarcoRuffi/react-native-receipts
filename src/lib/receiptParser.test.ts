import { parseReceiptText } from './receiptParser';
import type { ReceiptTextExtractor } from '../features/receipt/ReceiptTextExtractor';

const receipts = [
  {
    text: 'SUPERMERCATO SOLE\n03/04/2026\nTOTALE EURO 24,90',
    expected: { totalCents: 2490, date: '2026-04-03', merchant: 'SUPERMERCATO SOLE' },
  },
  {
    text: 'CAFFE CENTRALE\n08-04-26\nTOTALE 3,50',
    expected: { totalCents: 350, date: '2026-04-08', merchant: 'CAFFE CENTRALE' },
  },
  {
    text: 'STAZIONE SERVIZIO\n09.04.2026\nTOTALE COMPLESSIVO 1 234,56',
    expected: { totalCents: 123456, date: '2026-04-09', merchant: 'STAZIONE SERVIZIO' },
  },
  {
    text: 'FARMACIA VERDI\n10/04/2026\nT0TALE 12.40',
    expected: { totalCents: 1240, date: '2026-04-10', merchant: 'FARMACIA VERDI' },
  },
  {
    text: 'ALIMENTARI ROSSI\n11/04/2026\nSUBTOTALE 8,00\nRESTO 2,00\nTOTALE 6,00',
    expected: { totalCents: 600, date: '2026-04-11', merchant: 'ALIMENTARI ROSSI' },
  },
  {
    text: 'PIZZERIA ROMA\n12-04-26\nIMPORTO PAGATO\n18,00 EUR',
    expected: { totalCents: 1800, date: '2026-04-12', merchant: 'PIZZERIA ROMA' },
  },
  {
    text: 'AUTOGRILL NORD\n13.04.2026\nTOTALE 20.00\nTOTALE EURO 19,50',
    expected: { totalCents: 1950, date: '2026-04-13', merchant: 'AUTOGRILL NORD' },
  },
  {
    text: 'CARTOLERIA ARCO\n14/04/2026\nTOTALE EURO 7,25',
    expected: { totalCents: 725, date: '2026-04-14', merchant: 'CARTOLERIA ARCO' },
  },
  {
    text: 'PANIFICIO DEL BORGO\n15-04-26\nTOTALE 2,8',
    expected: { totalCents: 280, date: '2026-04-15', merchant: 'PANIFICIO DEL BORGO' },
  },
  {
    text: 'NEGOZIO CASA\n16.04.2026\nTOTALE 1.234,56',
    expected: { totalCents: 123456, date: '2026-04-16', merchant: 'NEGOZIO CASA' },
  },
];

describe('parseReceiptText (10 synthetic Italian receipts; expected success rate: 100%)', () => {
  it.each(receipts)('parses $expected.merchant', ({ text, expected }) => {
    expect(parseReceiptText(text)).toMatchObject({ ...expected, confidence: 1 });
  });

  it('achieves a 100% success rate across the synthetic receipt set', () => {
    const successfulCases = receipts.filter(({ text, expected }) => {
      const result = parseReceiptText(text);
      return result.totalCents === expected.totalCents
        && result.date === expected.date
        && result.merchant === expected.merchant;
    }).length;

    expect((successfulCases / receipts.length) * 100).toBe(100);
  });

  it('rejects invalid dates and reports partial confidence', () => {
    expect(parseReceiptText('BAR\n31/02/2026\nTOTALE 4,00')).toEqual({
      totalCents: 400,
      merchant: 'BAR',
      confidence: 0.75,
    });
  });

  it('does not interpret a total label as a merchant when no shop name is recognized', () => {
    expect(parseReceiptText('TOTALE 4,00')).toEqual({ totalCents: 400, confidence: 0.6 });
  });

  it('keeps the last valid total when a later total label has no readable amount', () => {
    expect(parseReceiptText('BAR\nTOTALE 4,00\nTOTALE')).toMatchObject({ totalCents: 400 });
  });

  it('supports a deterministic fake text extractor in tests', async () => {
    const fakeExtractor: ReceiptTextExtractor = {
      async extract(imageUri: string) {
        return imageUri ? 'BAR\nTOTALE 4,00' : '';
      },
    };

    await expect(fakeExtractor.extract('file:///receipt.jpg')).resolves.toBe('BAR\nTOTALE 4,00');
  });
});