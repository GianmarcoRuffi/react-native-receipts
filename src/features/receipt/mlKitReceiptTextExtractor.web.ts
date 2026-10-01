import {
  ReceiptTextExtractionUnavailableError,
  type ReceiptTextExtractor,
} from './ReceiptTextExtractor';

export const receiptTextExtractor: ReceiptTextExtractor = {
  async extract() {
    throw new ReceiptTextExtractionUnavailableError();
  },
};