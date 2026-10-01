import { render } from '@testing-library/react-native';

import { expenseText } from '@/src/constants/strings';
import TabOneScreen from '@/app/(tabs)/index';

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => callback(),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/src/features/expenses/useExpenses', () => ({
  useExpenses: () => ({ expenses: [], loading: false, error: null, reload: jest.fn() }),
}));

describe('expenses list', () => {
  it('renders the empty state', () => {
    const screen = render(<TabOneScreen />);

    expect(screen.getByText(expenseText.emptyTitle)).toBeTruthy();
    expect(screen.getByText(expenseText.emptyMessage)).toBeTruthy();
  });
});