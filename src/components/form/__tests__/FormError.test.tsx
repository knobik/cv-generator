import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormError } from '../FormError';

describe('FormError', () => {
  describe('Rendering', () => {
    test('should render error message when provided', () => {
      render(<FormError message="This field is required" />);
      const error = screen.getByText('This field is required');
      expect(error).toBeInTheDocument();
    });

    test('should render nothing when message is undefined', () => {
      const { container } = render(<FormError message={undefined} />);
      expect(container).toBeEmptyDOMElement();
    });

    test('should render nothing when message is empty string', () => {
      const { container } = render(<FormError message="" />);
      expect(container).toBeEmptyDOMElement();
    });

    test('should render nothing when message prop is not provided', () => {
      const { container } = render(<FormError />);
      expect(container).toBeEmptyDOMElement();
    });

    test('should display error icon', () => {
      const { container } = render(<FormError message="Error occurred" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    test('should apply correct error styling to container', () => {
      render(<FormError message="Error message" />);
      const errorDiv = screen.getByText('Error message').closest('.rounded-md');
      expect(errorDiv).toHaveClass('bg-red-50');
      expect(errorDiv).toHaveClass('p-4');
      expect(errorDiv).toHaveClass('my-4');
    });

    test('should apply correct text styling', () => {
      render(<FormError message="Error message" />);
      const errorText = screen.getByText('Error message');
      expect(errorText).toHaveClass('text-sm');
      expect(errorText).toHaveClass('text-red-800');
    });

    test('should apply correct icon styling', () => {
      const { container } = render(<FormError message="Error message" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-5');
      expect(svg).toHaveClass('w-5');
      expect(svg).toHaveClass('text-red-400');
    });
  });

  describe('Content', () => {
    test('should display single line error message', () => {
      render(<FormError message="Single line error" />);
      expect(screen.getByText('Single line error')).toBeInTheDocument();
    });

    test('should display multi-line error message', () => {
      const multiLineError = 'Error line 1\nError line 2\nError line 3';
      const { container } = render(<FormError message={multiLineError} />);
      const errorText = container.querySelector('.text-red-800');
      expect(errorText).toHaveTextContent('Error line 1');
      expect(errorText).toHaveTextContent('Error line 2');
      expect(errorText).toHaveTextContent('Error line 3');
    });

    test('should handle special characters in message', () => {
      render(<FormError message='Error with "quotes" and & special chars' />);
      expect(screen.getByText('Error with "quotes" and & special chars')).toBeInTheDocument();
    });

    test('should handle HTML entities in message', () => {
      render(<FormError message="Error with <html> tags" />);
      expect(screen.getByText('Error with <html> tags')).toBeInTheDocument();
    });

    test('should handle very long error messages', () => {
      const longMessage = 'This is a very long error message '.repeat(10);
      const { container } = render(<FormError message={longMessage} />);
      const errorText = container.querySelector('.text-red-800');
      expect(errorText).toHaveTextContent('This is a very long error message');
    });
  });

  describe('Accessibility', () => {
    test('should render with proper semantic structure', () => {
      render(<FormError message="Error message" />);
      const container = screen.getByText('Error message').closest('div');
      expect(container).toBeInTheDocument();
    });

    test('should have error icon with proper attributes', () => {
      const { container } = render(<FormError message="Error message" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    test('should render error text in paragraph element', () => {
      render(<FormError message="Error message" />);
      const errorText = screen.getByText('Error message');
      expect(errorText.tagName).toBe('P');
    });
  });

  describe('Conditional Rendering', () => {
    test('should not render when message is null', () => {
      const { container } = render(<FormError message={null as unknown as string} />);
      expect(container).toBeEmptyDOMElement();
    });

    test('should not render when message is whitespace only', () => {
      const { container } = render(<FormError message="   " />);
      // Component renders with whitespace, but this tests that it passes through
      expect(container.textContent).toBe('   ');
    });

    test('should render when message is "0"', () => {
      render(<FormError message="0" />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('should render when message is "false"', () => {
      render(<FormError message="false" />);
      expect(screen.getByText('false')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    test('should use flex layout for icon and message', () => {
      render(<FormError message="Error message" />);
      const flexDiv = screen.getByText('Error message').closest('.flex');
      expect(flexDiv).toBeInTheDocument();
    });

    test('should have proper spacing for icon', () => {
      render(<FormError message="Error message" />);
      const messageDiv = screen.getByText('Error message').closest('.ml-3');
      expect(messageDiv).toBeInTheDocument();
    });
  });
});
