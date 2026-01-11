import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormSelect } from '../FormSelect';

describe('FormSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  describe('Rendering', () => {
    test('should render select with options', () => {
      render(<FormSelect options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
    });

    test('should render select with label', () => {
      render(<FormSelect label="Choose an option" options={mockOptions} />);
      const label = screen.getByText('Choose an option');
      const select = screen.getByLabelText('Choose an option');
      expect(label).toBeInTheDocument();
      expect(select).toBeInTheDocument();
    });

    test('should generate select id from label', () => {
      render(<FormSelect label="Language Proficiency" options={mockOptions} />);
      const select = screen.getByLabelText('Language Proficiency');
      expect(select).toHaveAttribute('id', 'language-proficiency');
    });

    test('should use provided id over generated id', () => {
      render(<FormSelect label="Proficiency" id="custom-id" options={mockOptions} />);
      const select = screen.getByLabelText('Proficiency');
      expect(select).toHaveAttribute('id', 'custom-id');
    });

    test('should display error message when provided', () => {
      render(<FormSelect label="Level" options={mockOptions} error="Please select a level" />);
      const error = screen.getByText('Please select a level');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-red-600');
    });

    test('should display helper text when provided', () => {
      render(<FormSelect label="Level" options={mockOptions} helperText="Select your proficiency level" />);
      const helperText = screen.getByText('Select your proficiency level');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-gray-500');
    });

    test('should not display helper text when error is present', () => {
      render(
        <FormSelect
          label="Level"
          options={mockOptions}
          error="Required"
          helperText="This should not appear"
        />
      );
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });

    test('should render all options with correct values', () => {
      render(<FormSelect label="Level" options={mockOptions} />);
      const option1 = screen.getByRole('option', { name: 'Option 1' }) as HTMLOptionElement;
      const option2 = screen.getByRole('option', { name: 'Option 2' }) as HTMLOptionElement;
      const option3 = screen.getByRole('option', { name: 'Option 3' }) as HTMLOptionElement;

      expect(option1.value).toBe('option1');
      expect(option2.value).toBe('option2');
      expect(option3.value).toBe('option3');
    });

    test('should handle empty options array', () => {
      render(<FormSelect label="Level" options={[]} />);
      const select = screen.getByLabelText('Level');
      expect(select).toBeInTheDocument();
      expect(select.children).toHaveLength(0);
    });
  });

  describe('Styling', () => {
    test('should apply error styling when error is provided', () => {
      render(<FormSelect label="Level" options={mockOptions} error="Invalid" />);
      const select = screen.getByLabelText('Level');
      expect(select).toHaveClass('border-red-300');
      expect(select).toHaveClass('focus:ring-red-500');
      expect(select).toHaveClass('focus:border-red-500');
    });

    test('should apply normal styling when no error', () => {
      render(<FormSelect label="Level" options={mockOptions} />);
      const select = screen.getByLabelText('Level');
      expect(select).toHaveClass('border-gray-300');
    });

    test('should apply custom className', () => {
      render(<FormSelect label="Level" options={mockOptions} className="custom-class" />);
      const select = screen.getByLabelText('Level');
      expect(select).toHaveClass('custom-class');
    });

    test('should apply disabled styling when disabled', () => {
      render(<FormSelect label="Level" options={mockOptions} disabled />);
      const select = screen.getByLabelText('Level');
      expect(select).toHaveClass('disabled:bg-gray-100');
      expect(select).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('User Interaction', () => {
    test('should handle onChange events', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormSelect label="Level" options={mockOptions} onChange={handleChange} />);
      const select = screen.getByLabelText('Level');

      await user.selectOptions(select, 'option2');

      expect(handleChange).toHaveBeenCalled();
      expect(select).toHaveValue('option2');
    });

    test('should accept value prop', () => {
      render(<FormSelect label="Level" options={mockOptions} value="option2" onChange={() => {}} />);
      const select = screen.getByLabelText('Level') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });

    test('should be disabled when disabled prop is true', () => {
      render(<FormSelect label="Level" options={mockOptions} disabled />);
      const select = screen.getByLabelText('Level');
      expect(select).toBeDisabled();
    });

    test('should allow selecting different options', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormSelect label="Level" options={mockOptions} onChange={handleChange} />);
      const select = screen.getByLabelText('Level');

      await user.selectOptions(select, 'option1');
      expect(select).toHaveValue('option1');

      await user.selectOptions(select, 'option3');
      expect(select).toHaveValue('option3');
    });
  });

  describe('HTML Attributes', () => {
    test('should support required attribute', () => {
      render(<FormSelect label="Level" options={mockOptions} required />);
      const select = screen.getByLabelText('Level');
      expect(select).toBeRequired();
    });

    test('should support name attribute', () => {
      render(<FormSelect label="Level" options={mockOptions} name="proficiency" />);
      const select = screen.getByLabelText('Level');
      expect(select).toHaveAttribute('name', 'proficiency');
    });

    test('should support autoComplete attribute', () => {
      render(<FormSelect label="Level" options={mockOptions} autoComplete="off" />);
      const select = screen.getByLabelText('Level');
      expect(select).toHaveAttribute('autoComplete', 'off');
    });

    test('should support defaultValue attribute', () => {
      render(<FormSelect label="Level" options={mockOptions} defaultValue="option2" />);
      const select = screen.getByLabelText('Level') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });
  });

  describe('Options Rendering', () => {
    test('should render options with special characters in labels', () => {
      const specialOptions = [
        { value: 'opt1', label: 'Option with "quotes"' },
        { value: 'opt2', label: "Option with 'apostrophe'" },
        { value: 'opt3', label: 'Option with & ampersand' },
      ];

      render(<FormSelect label="Level" options={specialOptions} />);
      expect(screen.getByRole('option', { name: 'Option with "quotes"' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: "Option with 'apostrophe'" })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option with & ampersand' })).toBeInTheDocument();
    });

    test('should handle options with duplicate labels', () => {
      const duplicateOptions = [
        { value: 'opt1', label: 'Same Label' },
        { value: 'opt2', label: 'Same Label' },
      ];

      render(<FormSelect label="Level" options={duplicateOptions} />);
      const options = screen.getAllByRole('option', { name: 'Same Label' });
      expect(options).toHaveLength(2);
    });
  });
});
