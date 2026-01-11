import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  describe('Rendering', () => {
    test('should render children content', () => {
      render(<Card>Test content</Card>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('should render without header and footer', () => {
      const { container } = render(<Card>Content only</Card>);
      expect(container.querySelector('.border-b')).not.toBeInTheDocument();
      expect(container.querySelector('.border-t')).not.toBeInTheDocument();
    });

    test('should render with header', () => {
      render(<Card header={<h2>Card Header</h2>}>Content</Card>);
      expect(screen.getByText('Card Header')).toBeInTheDocument();
    });

    test('should render with footer', () => {
      render(<Card footer={<div>Card Footer</div>}>Content</Card>);
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });

    test('should render with both header and footer', () => {
      render(
        <Card header={<h2>Header</h2>} footer={<div>Footer</div>}>
          Main Content
        </Card>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    test('should apply base styling', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-gray-200');
      expect(card).toHaveClass('shadow-sm');
    });

    test('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('bg-white'); // Should still have base classes
    });

    test('should apply header border styling', () => {
      const { container } = render(<Card header={<div>Header</div>}>Content</Card>);
      const headerDiv = container.querySelector('.border-b');
      expect(headerDiv).toBeInTheDocument();
      expect(headerDiv).toHaveClass('px-6', 'py-4', 'border-b', 'border-gray-200');
    });

    test('should apply footer styling', () => {
      const { container } = render(<Card footer={<div>Footer</div>}>Content</Card>);
      const footerDiv = container.querySelector('.border-t');
      expect(footerDiv).toBeInTheDocument();
      expect(footerDiv).toHaveClass('px-6', 'py-4', 'border-t', 'border-gray-200', 'bg-gray-50');
    });

    test('should apply content padding', () => {
      const { container } = render(<Card>Content</Card>);
      const contentDiv = container.querySelector('.px-6.py-4');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveTextContent('Content');
    });
  });

  describe('Content', () => {
    test('should render multiple children', () => {
      render(
        <Card>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </Card>
      );
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    test('should render complex header content', () => {
      render(
        <Card
          header={
            <div>
              <h2>Title</h2>
              <p>Subtitle</p>
            </div>
          }
        >
          Content
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    test('should render complex footer content', () => {
      render(
        <Card
          footer={
            <div>
              <button>Action 1</button>
              <button>Action 2</button>
            </div>
          }
        >
          Content
        </Card>
      );
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
  });
});
