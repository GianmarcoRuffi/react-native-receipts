export interface ReceiptTextExtractor {
  extract(imageUri: string): Promise<string>;
}

export const RECEIPT_TEXT_EXTRACTION_TIMEOUT_MS = 20_000;

export class ReceiptTextExtractionTimeoutError extends Error {
  constructor() {
    super('Receipt text extraction timed out');
    this.name = 'ReceiptTextExtractionTimeoutError';
  }
}

export class ReceiptTextExtractionUnavailableError extends Error {
  constructor() {
    super('Receipt text extraction is unavailable on this platform');
    this.name = 'ReceiptTextExtractionUnavailableError';
  }
}

export async function extractReceiptTextWithTimeout(
  extractor: ReceiptTextExtractor,
  imageUri: string,
  timeoutMs = RECEIPT_TEXT_EXTRACTION_TIMEOUT_MS,
): Promise<string> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new ReceiptTextExtractionTimeoutError()), timeoutMs);
  });

  try {
    return await Promise.race([extractor.extract(imageUri), timeout]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}