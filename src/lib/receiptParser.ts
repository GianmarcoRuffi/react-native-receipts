export type ReceiptParseResult = {
  totalCents?: number;
  date?: string;
  merchant?: string;
  confidence: number;
};

const AMOUNT_PATTERN =
  /(?:^|[^\d])(\d{1,3}(?:[ .]\d{3})+|\d+)(?:([,.])(\d{1,2}))?(?!\d)/g;
const TOTAL_LABEL_PATTERN = /\b(?:TOTALE|TOT\.?|IMPORTO\s+PAGATO)\b/;
const EXCLUDED_TOTAL_PATTERN = /\b(?:SUBTOTALE|RESTO|ACCONTO)\b/;
const MERCHANT_NOISE_PATTERN =
  /\b(?:DOCUMENTO\s+COMMERCIALE|SCONTRINO|P\.?\s*IVA|PARTITA\s+IVA|CODICE\s+FISCALE|DESCRIZIONE|QUANTIT[AÀ]|PREZZO|PAGAMENTO|CONTANTE|BANCOMAT|SUBTOTALE|RESTO|TOTALE|IMPORTO)\b/i;

function parseAmount(line: string): number | undefined {
  for (const match of line.matchAll(AMOUNT_PATTERN)) {
    const euros = Number(match[1].replace(/[ .]/g, ''));
    const cents = Number((match[3] ?? '').padEnd(2, '0'));
    const amount = euros * 100 + cents;
    if (amount > 0) return amount;
  }

  return undefined;
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
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const totals: { amount: number; priority: number; index: number }[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const normalizedLine = lines[index].toUpperCase().replace(/0/g, 'O');
    if (EXCLUDED_TOTAL_PATTERN.test(normalizedLine)) continue;
    const label = TOTAL_LABEL_PATTERN.exec(normalizedLine);
    if (!label) continue;

    let amount = parseAmount(lines[index].slice(label.index + label[0].length));
    for (
      let offset = 1;
      amount === undefined && offset <= 2 && index + offset < lines.length;
      offset += 1
    ) {
      const followingLine = lines[index + offset]
        .toUpperCase()
        .replace(/0/g, 'O');
      if (
        EXCLUDED_TOTAL_PATTERN.test(followingLine) ||
        TOTAL_LABEL_PATTERN.test(followingLine)
      )
        break;
      amount = parseAmount(lines[index + offset]);
    }

    if (amount !== undefined) {
      const priority = /\b(?:DA\s+PAGARE|COMPLESSIVO|DOCUMENTO)\b/.test(
        normalizedLine,
      )
        ? 3
        : /\bIMPORTO\s+PAGATO\b/.test(normalizedLine)
          ? 1
          : 2;
      totals.push({ amount, priority, index });
    }
  }

  const total = totals.reduce<
    { amount: number; priority: number; index: number } | undefined
  >(
    (best, candidate) =>
      !best ||
      candidate.priority > best.priority ||
      (candidate.priority === best.priority && candidate.index > best.index)
        ? candidate
        : best,
    undefined,
  );
  const totalCents = total?.amount;
  const date = parseDate(text);
  const merchant = lines.find(
    (line) =>
      /[A-Za-zÀ-ÿ]/.test(line) &&
      !MERCHANT_NOISE_PATTERN.test(line) &&
      !parseDate(line),
  );
  const confidence =
    (totalCents ? 0.6 : 0) + (date ? 0.25 : 0) + (merchant ? 0.15 : 0);

  return {
    ...(totalCents ? { totalCents } : {}),
    ...(date ? { date } : {}),
    ...(merchant ? { merchant } : {}),
    confidence,
  };
}
