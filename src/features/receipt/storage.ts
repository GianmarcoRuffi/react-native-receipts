import { Directory, File, Paths } from 'expo-file-system';

const receiptsDirectory = new Directory(Paths.document, 'receipts');

function ensureReceiptsDirectory(): void {
  receiptsDirectory.create({ idempotent: true, intermediates: true });
}

function uniqueReceiptName(source: File): string {
  const extension = source.extension || '.jpg';
  return `receipt-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
}

export async function copyReceiptToStorage(sourceUri: string): Promise<string> {
  ensureReceiptsDirectory();
  const source = new File(sourceUri);
  const destination = new File(receiptsDirectory, uniqueReceiptName(source));
  await source.copy(destination);
  return destination.uri;
}

export async function deleteReceipt(uri: string | null | undefined): Promise<void> {
  if (!uri) return;
  const file = new File(uri);
  if (file.exists) file.delete();
}