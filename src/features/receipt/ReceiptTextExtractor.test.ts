import {
  extractReceiptTextWithTimeout,
  ReceiptTextExtractionTimeoutError,
  type ReceiptTextExtractor,
} from './ReceiptTextExtractor';

describe('extractReceiptTextWithTimeout', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns extracted text and passes the image URI to the extractor', async () => {
    const extractor: ReceiptTextExtractor = {
      async extract(imageUri) {
        return imageUri === 'file:///receipt.jpg' ? 'TOTALE 4,00' : '';
      },
    };

    await expect(extractReceiptTextWithTimeout(extractor, 'file:///receipt.jpg')).resolves.toBe('TOTALE 4,00');
  });

  it('rejects when the native extraction exceeds the timeout', async () => {
    jest.useFakeTimers();
    const extractor: ReceiptTextExtractor = {
      extract: () => new Promise<string>(() => undefined),
    };
    const result = extractReceiptTextWithTimeout(extractor, 'file:///receipt.jpg', 50);
    const rejection = expect(result).rejects.toBeInstanceOf(ReceiptTextExtractionTimeoutError);

    jest.advanceTimersByTime(50);
    await rejection;
  });
});