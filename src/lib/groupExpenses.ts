import type { Expense } from '@/src/types/domain';

export type ExpenseSection = {
  date: string;
  data: Expense[];
};

export function groupExpensesByDate(expenses: Expense[]): ExpenseSection[] {
  const sections: ExpenseSection[] = [];
  const sectionByDate = new Map<string, ExpenseSection>();

  for (const expense of expenses) {
    let section = sectionByDate.get(expense.date);
    if (!section) {
      section = { date: expense.date, data: [] };
      sectionByDate.set(expense.date, section);
      sections.push(section);
    }
    section.data.push(expense);
  }

  return sections;
}