import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormDatePicker } from '../FormDatePicker';

describe('FormDatePicker', () => {
  describe('Rendering', () => {
    test('should render date input', () => {
      const { container } = render(<FormDatePicker />);
      const input = container.querySelector('input[type="month"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'month');
    });

    test('should render date input with label', () => {
      render(<FormDatePicker label="Start Date" />);
      const label = screen.getByText('Start Date');
      const input = screen.getByLabelText('Start Date');
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    test('should generate input id from label', () => {
      render(<FormDatePicker label="Start Date" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('id', 'start-date');
    });

    test('should use provided id over generated id', () => {
      render(<FormDatePicker label="Start Date" id="custom-id" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    test('should display error message when provided', () => {
      render(<FormDatePicker label="Start Date" error="Invalid date format" />);
      const error = screen.getByText('Invalid date format');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-red-600');
    });

    test('should display helper text when provided', () => {
      render(<FormDatePicker label="Start Date" helperText="Format: YYYY-MM" />);
      const helperText = screen.getByText('Format: YYYY-MM');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-gray-500');
    });

    test('should not display helper text when error is present', () => {
      render(
        <FormDatePicker
          label="Start Date"
          error="Invalid date"
          helperText="This should not appear"
        />
      );
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });

    test('should have type="month" attribute', () => {
      render(<FormDatePicker label="Start Date" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('type', 'month');
    });
  });

  describe('Styling', () => {
    test('should apply error styling when error is provided', () => {
      render(<FormDatePicker label="Start Date" error="Invalid" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveClass('border-red-300');
      expect(input).toHaveClass('focus:ring-red-500');
      expect(input).toHaveClass('focus:border-red-500');
    });

    test('should apply normal styling when no error', () => {
      render(<FormDatePicker label="Start Date" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveClass('border-gray-300');
    });

    test('should apply custom className', () => {
      render(<FormDatePicker label="Start Date" className="custom-class" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveClass('custom-class');
    });

    test('should apply disabled styling when disabled', () => {
      render(<FormDatePicker label="Start Date" disabled />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveClass('disabled:bg-gray-100');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('User Interaction', () => {
    test('should handle onChange events', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormDatePicker label="Start Date" onChange={handleChange} />);
      const input = screen.getByLabelText('Start Date');

      await user.type(input, '2024-01');

      expect(handleChange).toHaveBeenCalled();
    });

    test('should accept value prop', () => {
      render(<FormDatePicker label="Start Date" value="2024-01" onChange={() => {}} />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveValue('2024-01');
    });

    test('should be disabled when disabled prop is true', () => {
      render(<FormDatePicker label="Start Date" disabled />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toBeDisabled();
    });

    test('should accept placeholder text', () => {
      render(<FormDatePicker label="Start Date" placeholder="YYYY-MM" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('placeholder', 'YYYY-MM');
    });

    test('should handle date clearing', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormDatePicker label="Start Date" value="2024-01" onChange={handleChange} />);
      const input = screen.getByLabelText('Start Date');

      await user.clear(input);

      expect(handleChange).toHaveBeenCalled();
      // Note: userEvent.clear() may not fully clear the value for month inputs in jsdom
    });
  });

  describe('HTML Attributes', () => {
    test('should support required attribute', () => {
      render(<FormDatePicker label="Start Date" required />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toBeRequired();
    });

    test('should support name attribute', () => {
      render(<FormDatePicker label="Start Date" name="startDate" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('name', 'startDate');
    });

    test('should support min attribute', () => {
      render(<FormDatePicker label="Start Date" min="2020-01" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('min', '2020-01');
    });

    test('should support max attribute', () => {
      render(<FormDatePicker label="Start Date" max="2025-12" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('max', '2025-12');
    });

    test('should support autoComplete attribute', () => {
      render(<FormDatePicker label="Start Date" autoComplete="off" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveAttribute('autoComplete', 'off');
    });
  });

  describe('Date Validation', () => {
    test('should accept valid date format (YYYY-MM)', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormDatePicker label="Start Date" onChange={handleChange} />);
      const input = screen.getByLabelText('Start Date');

      await user.type(input, '2024-06');

      expect(input).toHaveValue('2024-06');
    });

    test('should handle defaultValue attribute', () => {
      render(<FormDatePicker label="Start Date" defaultValue="2024-03" />);
      const input = screen.getByLabelText('Start Date');
      expect(input).toHaveValue('2024-03');
    });
  });
});
