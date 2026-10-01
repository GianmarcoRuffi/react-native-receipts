import { copyReceiptToStorage, deleteReceipt } from './storage';

const mockFiles = new Map<string, boolean>();

jest.mock('expo-file-system', () => {
  class MockDirectory {
    uri: string;

    constructor(...parts: (string | MockDirectory)[]) {
      this.uri = parts.map((part) => (typeof part === 'string' ? part : part.uri)).join('/');
    }

    create(): void {
      mockFiles.set(this.uri, true);
    }
  }

  class MockFile {
    uri: string;
    extension: string;

    constructor(...parts: (string | MockDirectory)[]) {
      this.uri = parts.map((part) => (typeof part === 'string' ? part : part.uri)).join('/');
      this.extension = this.uri.endsWith('.png') ? '.png' : '.jpg';
    }

    get exists(): boolean {
      return mockFiles.get(this.uri) === true;
    }

    async copy(destination: MockFile): Promise<void> {
      mockFiles.set(destination.uri, true);
    }

    delete(): void {
      mockFiles.delete(this.uri);
    }
  }

  return {
    Directory: MockDirectory,
    File: MockFile,
    Paths: { document: new MockDirectory('file:///documents') },
  };
});

describe('receipt storage', () => {
  it('copies a receipt to the app documents directory and deletes it', async () => {
    const uri = await copyReceiptToStorage('file:///cache/photo.jpg');

    expect(uri).toMatch(/^file:\/\/\/documents\/receipts\/receipt-/);
    expect(mockFiles.get(uri)).toBe(true);

    await deleteReceipt(uri);
    expect(mockFiles.get(uri)).toBeUndefined();
  });
});