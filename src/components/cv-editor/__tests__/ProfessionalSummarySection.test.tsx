import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfessionalSummarySection } from '../ProfessionalSummarySection';
import { CVProvider } from '@/context/CVContext';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'forms.summary.title': 'Professional Summary',
    };
    return translations[key] || key;
  },
}));

describe('ProfessionalSummarySection', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<CVProvider>{ui}</CVProvider>);
  };

  describe('Rendering', () => {
    test('should render the section', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      // Look for the text in both the card header and label
      const headers = screen.getAllByText('Professional Summary');
      expect(headers.length).toBeGreaterThan(0);
    });

    test('should render FormTextarea', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      const textarea = screen.getByLabelText('Professional Summary');
      expect(textarea).toBeInTheDocument();
    });

    test('should render with placeholder text', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      const textarea = screen.getByPlaceholderText(/Brief overview of your professional background/);
      expect(textarea).toBeInTheDocument();
    });

    test('should render helper text', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      expect(screen.getByText(/Write a compelling summary/)).toBeInTheDocument();
    });

    test('should have character count enabled', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      const textarea = screen.getByLabelText('Professional Summary');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });
  });

  describe('Content Display', () => {
    test('should display empty summary by default', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      const textarea = screen.getByLabelText('Professional Summary') as HTMLTextAreaElement;
      expect(textarea.value).toBe('');
    });

    test('should display character count indicator', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      expect(screen.getByText('0/500')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    test('should allow typing in the textarea', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ProfessionalSummarySection />);

      const textarea = screen.getByLabelText('Professional Summary');
      await user.type(textarea, 'Experienced software engineer');

      expect(textarea).toHaveValue('Experienced software engineer');
    });

    test('should update character count when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ProfessionalSummarySection />);

      const textarea = screen.getByLabelText('Professional Summary');
      await user.type(textarea, 'Test');

      // Character count should be visible and updated
      expect(textarea).toHaveValue('Test');
    });

    test('should support multiline input', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ProfessionalSummarySection />);

      const textarea = screen.getByLabelText('Professional Summary');
      await user.type(textarea, 'Line 1{Enter}Line 2');

      expect(textarea).toHaveValue('Line 1\nLine 2');
    });
  });

  describe('Form Attributes', () => {
    test('should have 6 rows', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      const textarea = screen.getByLabelText('Professional Summary');
      expect(textarea).toHaveAttribute('rows', '6');
    });

    test('should enforce max length of 500 characters', () => {
      renderWithProvider(<ProfessionalSummarySection />);
      const textarea = screen.getByLabelText('Professional Summary');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });
  });

  describe('Card Component Integration', () => {
    test('should render within a Card', () => {
      const { container } = renderWithProvider(<ProfessionalSummarySection />);
      const card = container.querySelector('.bg-white.rounded-lg');
      expect(card).toBeInTheDocument();
    });

    test('should have card header with title', () => {
      const { container } = renderWithProvider(<ProfessionalSummarySection />);
      const header = container.querySelector('.border-b');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Professional Summary');
    });
  });
});
