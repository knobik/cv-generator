import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  describe('Rendering', () => {
    test('should render input without label', () => {
      render(<FormInput placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    test('should render input with label', () => {
      render(<FormInput label="Full Name" />);
      const label = screen.getByText('Full Name');
      const input = screen.getByLabelText('Full Name');
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    test('should generate input id from label', () => {
      render(<FormInput label="First Name" />);
      const input = screen.getByLabelText('First Name');
      expect(input).toHaveAttribute('id', 'first-name');
    });

    test('should use provided id over generated id', () => {
      render(<FormInput label="First Name" id="custom-id" />);
      const input = screen.getByLabelText('First Name');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    test('should display error message when provided', () => {
      render(<FormInput label="Email" error="Invalid email address" />);
      const error = screen.getByText('Invalid email address');
      expect(error).toBeInTheDocument();
      expect(error).toHaveClass('text-red-600');
    });

    test('should display helper text when provided', () => {
      render(<FormInput label="Email" helperText="We'll never share your email" />);
      const helperText = screen.getByText("We'll never share your email");
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-gray-500');
    });

    test('should not display helper text when error is present', () => {
      render(
        <FormInput
          label="Email"
          error="Invalid email"
          helperText="This should not appear"
        />
      );
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    test('should apply error styling when error is provided', () => {
      render(<FormInput label="Email" error="Invalid" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-red-300');
      expect(input).toHaveClass('focus:ring-red-500');
      expect(input).toHaveClass('focus:border-red-500');
    });

    test('should apply normal styling when no error', () => {
      render(<FormInput label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-gray-300');
    });

    test('should apply custom className', () => {
      render(<FormInput label="Email" className="custom-class" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('custom-class');
    });

    test('should apply disabled styling when disabled', () => {
      render(<FormInput label="Email" disabled />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('disabled:bg-gray-100');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('User Interaction', () => {
    test('should handle onChange events', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FormInput label="Name" onChange={handleChange} />);
      const input = screen.getByLabelText('Name');

      await user.type(input, 'John Doe');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('John Doe');
    });

    test('should accept value prop', () => {
      render(<FormInput label="Name" value="Jane Doe" onChange={() => {}} />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveValue('Jane Doe');
    });

    test('should be disabled when disabled prop is true', () => {
      render(<FormInput label="Name" disabled />);
      const input = screen.getByLabelText('Name');
      expect(input).toBeDisabled();
    });

    test('should accept placeholder text', () => {
      render(<FormInput label="Name" placeholder="Enter your name" />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveAttribute('placeholder', 'Enter your name');
    });
  });

  describe('Input Types', () => {
    test('should support text input type', () => {
      render(<FormInput label="Name" type="text" />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should support email input type', () => {
      render(<FormInput label="Email" type="email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('should support password input type', () => {
      render(<FormInput label="Password" type="password" />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    test('should support number input type', () => {
      render(<FormInput label="Age" type="number" />);
      const input = screen.getByLabelText('Age');
      expect(input).toHaveAttribute('type', 'number');
    });

    test('should support tel input type', () => {
      render(<FormInput label="Phone" type="tel" />);
      const input = screen.getByLabelText('Phone');
      expect(input).toHaveAttribute('type', 'tel');
    });

    test('should support url input type', () => {
      render(<FormInput label="Website" type="url" />);
      const input = screen.getByLabelText('Website');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  describe('HTML Attributes', () => {
    test('should support required attribute', () => {
      render(<FormInput label="Name" required />);
      const input = screen.getByLabelText('Name');
      expect(input).toBeRequired();
    });

    test('should support maxLength attribute', () => {
      render(<FormInput label="Name" maxLength={50} />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    test('should support name attribute', () => {
      render(<FormInput label="Name" name="fullName" />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveAttribute('name', 'fullName');
    });

    test('should support autoComplete attribute', () => {
      render(<FormInput label="Email" autoComplete="email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });
  });
});
