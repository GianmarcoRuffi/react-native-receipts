import TextRecognition from '@react-native-ml-kit/text-recognition';

import type { ReceiptTextExtractor } from './ReceiptTextExtractor';

export const receiptTextExtractor: ReceiptTextExtractor = {
  async extract(imageUri) {
    const result = await TextRecognition.recognize(imageUri);
    return result.text;
  },
};