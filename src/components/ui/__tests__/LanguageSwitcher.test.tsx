import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock the LocaleContext
const mockSetLocale = vi.fn();
vi.mock('@/context/LocaleContext', () => ({
  useLocale: () => ({
    locale: 'en',
    setLocale: mockSetLocale,
  }),
}));

// Mock the i18n config
vi.mock('@/i18n/config', () => ({
  locales: ['en', 'pl'],
  localeNames: {
    en: 'English',
    pl: 'Polski',
  },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render language options', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.getByText('PL')).toBeInTheDocument();
    });

    test('should render buttons for each locale', () => {
      render(<LanguageSwitcher />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    test('should display locale codes in uppercase', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.queryByText('en')).not.toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    test('should highlight current locale (EN)', () => {
      render(<LanguageSwitcher />);
      const enButton = screen.getByText('EN');
      expect(enButton).toHaveClass('bg-blue-600');
      expect(enButton).toHaveClass('text-white');
    });

    test('should not highlight non-active locale', () => {
      render(<LanguageSwitcher />);
      const plButton = screen.getByText('PL');
      expect(plButton).not.toHaveClass('bg-blue-600');
      expect(plButton).toHaveClass('text-gray-700');
    });
  });

  describe('User Interaction', () => {
    test('should call setLocale when clicking a language button', async () => {
      const user = userEvent.setup();
      render(<LanguageSwitcher />);

      const plButton = screen.getByText('PL');
      await user.click(plButton);

      expect(mockSetLocale).toHaveBeenCalledWith('pl');
    });

    test('should call setLocale for EN button', async () => {
      const user = userEvent.setup();
      render(<LanguageSwitcher />);

      const enButton = screen.getByText('EN');
      await user.click(enButton);

      expect(mockSetLocale).toHaveBeenCalledWith('en');
    });

    test('should handle multiple clicks', async () => {
      const user = userEvent.setup();
      render(<LanguageSwitcher />);

      await user.click(screen.getByText('PL'));
      await user.click(screen.getByText('EN'));
      await user.click(screen.getByText('PL'));

      expect(mockSetLocale).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    test('should have aria-labels for language buttons', () => {
      render(<LanguageSwitcher />);
      expect(screen.getByLabelText('Switch to English')).toBeInTheDocument();
      expect(screen.getByLabelText('Switch to Polski')).toBeInTheDocument();
    });

    test('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<LanguageSwitcher />);

      const plButton = screen.getByText('PL');
      plButton.focus();
      expect(plButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockSetLocale).toHaveBeenCalledWith('pl');
    });
  });

  describe('Styling', () => {
    test('should have container styling', () => {
      const { container } = render(<LanguageSwitcher />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'items-center', 'gap-1', 'bg-gray-100', 'rounded-md', 'p-1');
    });

    test('should have base button styling', () => {
      render(<LanguageSwitcher />);
      const plButton = screen.getByText('PL');
      expect(plButton).toHaveClass('px-3', 'py-1', 'rounded', 'text-sm', 'font-medium', 'transition-colors');
    });

    test('should have hover styling for inactive buttons', () => {
      render(<LanguageSwitcher />);
      const plButton = screen.getByText('PL');
      expect(plButton).toHaveClass('hover:bg-gray-200');
    });
  });
});
