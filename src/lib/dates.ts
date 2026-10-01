function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function monthRange(month: string): { from: string; to: string } {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  const year = match ? Number(match[1]) : NaN;
  const monthNumber = match ? Number(match[2]) : NaN;

  if (!Number.isInteger(year) || monthNumber < 1 || monthNumber > 12) {
    throw new Error('Invalid month');
  }

  const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return {
    from: `${year}-${pad(monthNumber)}-01`,
    to: `${year}-${pad(monthNumber)}-${pad(lastDay)}`,
  };
}

export function shiftMonth(month: string, offset: number): string {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  const year = match ? Number(match[1]) : NaN;
  const monthNumber = match ? Number(match[2]) : NaN;

  if (!Number.isInteger(year) || monthNumber < 1 || monthNumber > 12 || !Number.isInteger(offset)) {
    throw new Error('Invalid month');
  }

  const shifted = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}`;
}