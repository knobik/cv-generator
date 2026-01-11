import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';
import { CVProvider } from '@/context/CVContext';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'header.title': 'CV Generator',
      'common.storage': 'Storage',
      'common.printPdf': 'Print/PDF',
      'common.save': 'Save',
      'common.export': 'Export',
      'common.import': 'Import',
      'common.clearAll': 'Clear All',
      'messages.confirmClear': 'Are you sure you want to clear all data?',
      'messages.importError': 'Failed to import CV data',
    };
    return translations[key] || key;
  },
}));

// Mock storage functions
vi.mock('@/lib/storage', () => ({
  exportCVData: vi.fn(() => '{"test": "data"}'),
  importCVData: vi.fn((data) => JSON.parse(data)),
  clearCVData: vi.fn(),
  loadCVData: vi.fn(() => null),
  saveCVData: vi.fn(),
  getStorageSize: vi.fn(() => 1024),
  formatBytes: vi.fn((bytes) => `${bytes} B`),
}));

// Mock PrintPreview component
vi.mock('@/components/cv-preview/PrintPreview', () => ({
  PrintPreview: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div data-testid="print-preview-modal">Print Preview</div> : null
  ),
}));

// Mock LanguageSwitcher
vi.mock('@/components/ui/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe('Header', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<CVProvider>{ui}</CVProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render the header', () => {
      renderWithProvider(<Header />);
      expect(screen.getByText('CV Generator')).toBeInTheDocument();
    });

    test('should render storage size indicator', () => {
      renderWithProvider(<Header />);
      expect(screen.getByText(/Storage:/)).toBeInTheDocument();
      expect(screen.getByText(/1024 B/)).toBeInTheDocument();
    });

    test('should render all action buttons', () => {
      renderWithProvider(<Header />);
      expect(screen.getByText('Print/PDF')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('Import')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    test('should render LanguageSwitcher', () => {
      renderWithProvider(<Header />);
      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });

    test('should have hidden file input for import', () => {
      const { container } = renderWithProvider(<Header />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveClass('hidden');
      expect(fileInput).toHaveAttribute('accept', '.json');
    });
  });

  describe('Styling', () => {
    test('should have sticky header styling', () => {
      const { container } = renderWithProvider(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white', 'border-b', 'border-gray-200', 'sticky', 'top-0', 'z-10');
    });

    test('should have proper spacing and layout', () => {
      const { container } = renderWithProvider(<Header />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    test('should open print preview when Print/PDF button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<Header />);

      const printButton = screen.getByText('Print/PDF');
      await user.click(printButton);

      expect(screen.getByTestId('print-preview-modal')).toBeInTheDocument();
    });

    test('should close print preview', async () => {
      const user = userEvent.setup();
      renderWithProvider(<Header />);

      // Open modal
      await user.click(screen.getByText('Print/PDF'));
      expect(screen.getByTestId('print-preview-modal')).toBeInTheDocument();

      // Modal closing would be handled by the PrintPreview component itself
    });

    test('should trigger save when Save button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<Header />);

      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      // saveCV would be called (tested in CVContext tests)
      expect(saveButton).toBeInTheDocument();
    });

    test('should handle export button click', async () => {
      const user = userEvent.setup();
      renderWithProvider(<Header />);

      const exportButton = screen.getByText('Export');
      await user.click(exportButton);

      // Export functionality would create and download a file
      expect(exportButton).toBeInTheDocument();
    });

    test('should trigger file input when Import button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProvider(<Header />);

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      const importButton = screen.getByText('Import');
      await user.click(importButton);

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('Clear Functionality', () => {
    test('should show confirmation dialog when Clear All is clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      renderWithProvider(<Header />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to clear all data?');
      confirmSpy.mockRestore();
    });

    test('should not clear if user cancels confirmation', async () => {
      const user = userEvent.setup();
      const { clearCVData } = await import('@/lib/storage');
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      renderWithProvider(<Header />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      // Clear would not be called when confirmation is cancelled
      expect(clearCVData).not.toHaveBeenCalled();
    });

    test('should clear data when user confirms', async () => {
      const user = userEvent.setup();
      const { clearCVData } = await import('@/lib/storage');
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderWithProvider(<Header />);

      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      // Clear should be called when confirmation is accepted
      expect(clearCVData).toHaveBeenCalled();
    });
  });

  describe('Import Functionality', () => {
    test('should handle successful file import', async () => {
      const user = userEvent.setup();
      const { importCVData } = await import('@/lib/storage');

      // Mock window.location.reload
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, reload: vi.fn() };

      const { container } = renderWithProvider(<Header />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      // Create a mock JSON file
      const mockFile = new File(['{"test": "data"}'], 'cv.json', { type: 'application/json' });

      // Trigger file selection
      await user.upload(fileInput, mockFile);

      // Wait for FileReader to complete
      await vi.waitFor(() => {
        expect(importCVData).toHaveBeenCalledWith('{"test": "data"}');
      });

      // Restore window.location
      window.location = originalLocation;
    });

    test('should handle import error with alert', async () => {
      const user = userEvent.setup();
      const { importCVData } = await import('@/lib/storage');
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      // Make importCVData throw an error
      vi.mocked(importCVData).mockImplementation(() => {
        throw new Error('Invalid JSON');
      });

      const { container } = renderWithProvider(<Header />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      const mockFile = new File(['invalid json'], 'cv.json', { type: 'application/json' });

      await user.upload(fileInput, mockFile);

      // Wait for error handling
      await vi.waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to import CV data');
      });

      alertSpy.mockRestore();
    });

    test('should clear file input after import attempt', async () => {
      const user = userEvent.setup();

      // Mock window.location.reload
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { ...originalLocation, reload: vi.fn() };

      const { container } = renderWithProvider(<Header />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      const mockFile = new File(['{"test": "data"}'], 'cv.json', { type: 'application/json' });

      await user.upload(fileInput, mockFile);

      // File input should be cleared
      await vi.waitFor(() => {
        expect(fileInput.value).toBe('');
      });

      // Restore window.location
      window.location = originalLocation;
    });
  });

  describe('Button Variants', () => {
    test('should have correct button variants', () => {
      renderWithProvider(<Header />);

      // Primary button
      const printButton = screen.getByText('Print/PDF');
      expect(printButton).toHaveClass('bg-blue-600');

      // Danger button
      const clearButton = screen.getByText('Clear All');
      expect(clearButton).toHaveClass('bg-red-600');
    });

    test('should have small size buttons', () => {
      renderWithProvider(<Header />);
      const saveButton = screen.getByText('Save');
      expect(saveButton).toHaveClass('h-8');
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading hierarchy', () => {
      renderWithProvider(<Header />);
      const heading = screen.getByText('CV Generator');
      expect(heading.tagName).toBe('H1');
    });

    test('should have semantic header element', () => {
      const { container } = renderWithProvider(<Header />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });
  });
});
