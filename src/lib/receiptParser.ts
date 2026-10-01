export type ReceiptParseResult = {
  totalCents?: number;
  date?: string;
  merchant?: string;
  confidence: number;
};

function parseAmount(line: string): number | undefined {
  const match = line.match(/(?:^|[^\dA-Za-zÀ-ÿ])(\d{1,3}(?:[ .]\d{3})+|\d+)(?:([,.])(\d{1,2}))?(?!\d)/);
  if (!match) return undefined;

  const euros = Number(match[1].replace(/[ .]/g, ''));
  const cents = Number((match[3] ?? '').padEnd(2, '0'));
  const amount = euros * 100 + cents;
  return amount > 0 ? amount : undefined;
}

function parseDate(text: string): string | undefined {
  const match = text.match(/\b(\d{1,2})([/.\-])(\d{1,2})\2(\d{2}|\d{4})\b/);
  if (!match) return undefined;

  const day = Number(match[1]);
  const month = Number(match[3]);
  const year = Number(match[4].length === 2 ? `20${match[4]}` : match[4]);
  const daysInMonth = new Date(year, month, 0).getDate();
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth) return undefined;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Uses the last valid total-labeled amount and first non-total alphabetic line as merchant; confidence weights total/date/merchant as 0.6/0.25/0.15. */
export function parseReceiptText(text: string): ReceiptParseResult {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  let totalCents: number | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const normalizedLine = lines[index].toUpperCase().replace(/0/g, 'O');
    if (/\b(?:SUBTOTALE|RESTO)\b/.test(normalizedLine)) continue;
    if (!/\b(?:TOTALE(?:\s+EURO)?|IMPORTO\s+PAGATO)\b/.test(normalizedLine)) continue;

    const candidate = parseAmount(lines[index]) ?? parseAmount(lines[index + 1] ?? '');
    if (candidate !== undefined) totalCents = candidate;
  }

  const date = parseDate(text);
  const merchant = lines.find((line) => (
    /[A-Za-zÀ-ÿ]/.test(line)
    && !/\b(?:T[O0]TALE|SUBTOTALE|RESTO|IMPORTO\s+PAGATO)\b/i.test(line)
  ));
  const confidence = (totalCents ? 0.6 : 0) + (date ? 0.25 : 0) + (merchant ? 0.15 : 0);

  return {
    ...(totalCents ? { totalCents } : {}),
    ...(date ? { date } : {}),
    ...(merchant ? { merchant } : {}),
    confidence,
  };
}