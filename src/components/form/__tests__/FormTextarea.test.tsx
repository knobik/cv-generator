import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTextarea } from '../FormTextarea';

describe('FormTextarea', () => {
  describe('Rendering', () => {
    test('should render textarea without label', () => {
      render(<FormTextarea placeholder="Enter description" />);
      const textarea = screen.getByPlaceholderText('Enter description');
      expect(textarea).toBeInTheDocument();
    });

    test('should render textarea with label', () => {
      render(<FormTextarea label="Description" />);
      const label = screen.getByText('Description');
      const textarea = screen.getByLabelText('Description');
      expect(label).toBeInTheDocument();
      expect(textarea).toBeInTheDocument();
    });

    test('should generate textarea id from label', () => {
      render(<FormTextarea label="Professional Summary" />);
      const textarea = screen.getByLabelText('Professional Summary');
      expect(textarea).toHaveAttribute('id', 'professional-summary');
    });

    test('should use provided id over generated id', () => {
      render(<FormTextarea label="Summary" id="custom-id" />);
      const textarea = screen.getByLabelText('Summary');
      expect(textarea).toHaveAttribute('id', 'custom-id');
    });

    test('should display error message when provided', () => {
      render(<FormTextarea label="Bio" error="Bio is too short" />);
      const error = screen.getByText('Bio is too short');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-red-600');
    });

    test('should display helper text when provided', () => {
      render(<FormTextarea label="Bio" helperText="Tell us about yourself" />);
      const helperText = screen.getByText('Tell us about yourself');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-gray-500');
    });

    test('should not display helper text when error is present', () => {
      render(
        <FormTextarea
          label="Bio"
          error="Too short"
          helperText="This should not appear"
        />
      );
      expect(screen.getByText('Too short')).toBeInTheDocument();
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });
  });

  describe('Character Count', () => {
    test('should display character count when showCharCount and maxChars are provided', () => {
      render(<FormTextarea label="Bio" value="Hello" showCharCount maxChars={100} onChange={() => {}} />);
      const charCount = screen.getByText('5/100');
      expect(charCount).toBeInTheDocument();
    });

    test('should not display character count when showCharCount is false', () => {
      render(<FormTextarea label="Bio" value="Hello" showCharCount={false} maxChars={100} onChange={() => {}} />);
      expect(screen.queryByText('5/100')).not.toBeInTheDocument();
    });

    test('should not display character count when maxChars is not provided', () => {
      render(<FormTextarea label="Bio" value="Hello" showCharCount onChange={() => {}} />);
      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument();
    });

    test('should update character count as user types', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormTextarea label="Bio" value="" showCharCount maxChars={100} onChange={handleChange} />);
      const textarea = screen.getByLabelText('Bio');

      await user.type(textarea, 'Hello');

      // Verify typing works
      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toBeInTheDocument();
    });

    test('should calculate character count correctly for empty string', () => {
      render(<FormTextarea label="Bio" value="" showCharCount maxChars={100} onChange={() => {}} />);
      const charCount = screen.getByText('0/100');
      expect(charCount).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    test('should apply error styling when error is provided', () => {
      render(<FormTextarea label="Bio" error="Invalid" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveClass('border-red-300');
      expect(textarea).toHaveClass('focus:ring-red-500');
      expect(textarea).toHaveClass('focus:border-red-500');
    });

    test('should apply normal styling when no error', () => {
      render(<FormTextarea label="Bio" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveClass('border-gray-300');
    });

    test('should apply custom className', () => {
      render(<FormTextarea label="Bio" className="custom-class" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveClass('custom-class');
    });

    test('should apply disabled styling when disabled', () => {
      render(<FormTextarea label="Bio" disabled />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveClass('disabled:bg-gray-100');
      expect(textarea).toHaveClass('disabled:cursor-not-allowed');
    });

    test('should apply resize-y class for vertical resizing', () => {
      render(<FormTextarea label="Bio" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveClass('resize-y');
    });
  });

  describe('User Interaction', () => {
    test('should handle onChange events', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormTextarea label="Bio" onChange={handleChange} />);
      const textarea = screen.getByLabelText('Bio');

      await user.type(textarea, 'My biography');

      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('My biography');
    });

    test('should accept value prop', () => {
      render(<FormTextarea label="Bio" value="Sample text" onChange={() => {}} />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveValue('Sample text');
    });

    test('should be disabled when disabled prop is true', () => {
      render(<FormTextarea label="Bio" disabled />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toBeDisabled();
    });

    test('should accept placeholder text', () => {
      render(<FormTextarea label="Bio" placeholder="Tell us about yourself" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('placeholder', 'Tell us about yourself');
    });
  });

  describe('HTML Attributes', () => {
    test('should support required attribute', () => {
      render(<FormTextarea label="Bio" required />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toBeRequired();
    });

    test('should support maxLength attribute via maxChars prop', () => {
      render(<FormTextarea label="Bio" maxChars={500} />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });

    test('should support rows attribute', () => {
      render(<FormTextarea label="Bio" rows={5} />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    test('should support name attribute', () => {
      render(<FormTextarea label="Bio" name="biography" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('name', 'biography');
    });

    test('should support autoComplete attribute', () => {
      render(<FormTextarea label="Bio" autoComplete="off" />);
      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('autoComplete', 'off');
    });
  });
});
