export function parseEuroToCents(value: string): number {
  const normalized = value.trim().replace(',', '.');

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error('Invalid euro amount');
  }

  const [euros, cents = ''] = normalized.split('.');
  const amount = Number(euros) * 100 + Number(cents.padEnd(2, '0'));

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error('Invalid euro amount');
  }

  return amount;
}

export function formatCents(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new Error('Invalid cents amount');
  }

  const euros = Math.floor(cents / 100);
  const remainder = String(cents % 100).padStart(2, '0');
  return `${euros},${remainder} €`;
}

export function formatCentsForInput(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new Error('Invalid cents amount');
  }

  const euros = Math.floor(cents / 100);
  const remainder = String(cents % 100).padStart(2, '0');
  return `${euros},${remainder}`;
}

export function formatSignedCents(cents: number): string {
  return `${cents >= 0 ? '+' : '-'}${formatCents(Math.abs(cents))}`;
}