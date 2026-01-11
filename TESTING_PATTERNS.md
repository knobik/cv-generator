# Testing Patterns & Best Practices

This document outlines the testing patterns, conventions, and best practices used in the CV Generator project.

## Table of Contents
1. [Testing Stack](#testing-stack)
2. [File Organization](#file-organization)
3. [Testing Patterns](#testing-patterns)
4. [Mocking Strategies](#mocking-strategies)
5. [Common Testing Scenarios](#common-testing-scenarios)
6. [Best Practices](#best-practices)

---

## Testing Stack

- **Test Runner:** Vitest 4.x
- **Testing Library:** @testing-library/react 14.x
- **User Interaction:** @testing-library/user-event 14.x
- **Assertions:** @testing-library/jest-dom 6.x
- **Coverage:** v8 (built into Vitest)

---

## File Organization

### Directory Structure
```
src/
├── lib/
│   ├── __tests__/
│   │   ├── validation.test.ts
│   │   ├── storage.test.ts
│   │   └── utils.test.ts
│   └── hooks/
│       └── __tests__/
│           ├── useLocalStorage.test.ts
│           └── useCVData.test.ts
├── context/
│   └── __tests__/
│       └── CVContext.test.tsx
└── components/
    ├── form/__tests__/
    ├── ui/__tests__/
    ├── layout/__tests__/
    └── cv-editor/__tests__/
```

### Naming Conventions
- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Test suites: Use `describe()` blocks to group related tests
- Test names: Use `test()` with descriptive names starting with "should"

---

## Testing Patterns

### 1. Arrange-Act-Assert (AAA) Pattern

```typescript
test('should update personal info fields', () => {
  // Arrange: Set up test data and render component
  const { result } = renderHook(() => useCVData(), { wrapper: CVProvider });

  // Act: Perform the action
  act(() => {
    result.current.updatePersonalInfo({ firstName: 'John' });
  });

  // Assert: Verify the outcome
  expect(result.current.cvData.personalInfo.firstName).toBe('John');
});
```

### 2. Test Organization

Group tests by functionality using nested `describe()` blocks:

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    test('should render with default props', () => {});
    test('should render with custom props', () => {});
  });

  describe('User Interaction', () => {
    test('should handle click events', () => {});
    test('should handle input changes', () => {});
  });

  describe('Edge Cases', () => {
    test('should handle null values', () => {});
    test('should handle empty strings', () => {});
  });

  describe('Error Handling', () => {
    test('should display error message', () => {});
    test('should handle invalid input', () => {});
  });
});
```

### 3. Component Testing Pattern

```typescript
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render the component', () => {
      render(<MyComponent />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    test('should handle user input', async () => {
      const user = userEvent.setup();
      render(<MyComponent />);

      const input = screen.getByLabelText('Input Label');
      await user.type(input, 'test value');

      expect(input).toHaveValue('test value');
    });
  });
});
```

### 4. Hook Testing Pattern

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCustomHook', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCustomHook('default'));
    expect(result.current.value).toBe('default');
  });

  test('should update value', () => {
    const { result } = renderHook(() => useCustomHook('initial'));

    act(() => {
      result.current.setValue('updated');
    });

    expect(result.current.value).toBe('updated');
  });
});
```

### 5. Context Provider Testing Pattern

```typescript
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<CVProvider>{ui}</CVProvider>);
};

describe('ComponentWithContext', () => {
  test('should access context values', () => {
    renderWithProvider(<ComponentWithContext />);
    expect(screen.getByText('Context Value')).toBeInTheDocument();
  });
});
```

---

## Mocking Strategies

### 1. Mocking Modules

```typescript
// Mock next-intl translations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'key.one': 'Translation One',
      'key.two': 'Translation Two',
    };
    return translations[key] || key;
  },
}));
```

### 2. Mocking Functions

```typescript
// Mock storage functions
vi.mock('@/lib/storage', () => ({
  exportCVData: vi.fn(() => '{"test": "data"}'),
  importCVData: vi.fn((data) => JSON.parse(data)),
  clearCVData: vi.fn(),
  loadCVData: vi.fn(() => null),
  saveCVData: vi.fn(),
}));
```

### 3. Mocking Components

```typescript
// Mock complex child components
vi.mock('@/components/cv-preview/PrintPreview', () => ({
  PrintPreview: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div data-testid="print-preview-modal">Print Preview</div> : null
  ),
}));
```

### 4. Mocking localStorage

```typescript
beforeEach(() => {
  localStorage.clear();
});

test('should save to localStorage', () => {
  const { result } = renderHook(() => useLocalStorage('key', 'default'));

  act(() => {
    result.current[1]('new value');
  });

  expect(localStorage.getItem('key')).toBe(JSON.stringify('new value'));
});
```

### 5. Mocking Browser APIs

```typescript
test('should handle file upload', async () => {
  const user = userEvent.setup();
  render(<FileUpload />);

  const file = new File(['content'], 'test.json', { type: 'application/json' });
  const input = screen.getByLabelText('Upload');

  await user.upload(input, file);

  expect(input.files[0]).toBe(file);
});
```

### 6. Mocking window.location

```typescript
test('should handle navigation', () => {
  const originalLocation = window.location;
  delete (window as any).location;
  window.location = { ...originalLocation, reload: vi.fn() };

  // Test code that uses window.location.reload()

  // Restore
  window.location = originalLocation;
});
```

---

## Common Testing Scenarios

### 1. Testing Form Components

```typescript
describe('FormInput', () => {
  test('should render input with label', () => {
    render(<FormInput label="Name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  test('should display error message', () => {
    render(<FormInput label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  test('should handle onChange events', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<FormInput label="Name" onChange={handleChange} />);
    const input = screen.getByLabelText('Name');

    await user.type(input, 'John');

    expect(handleChange).toHaveBeenCalled();
  });
});
```

### 2. Testing Async Operations

```typescript
test('should handle async data loading', async () => {
  const mockData = { id: 1, name: 'Test' };
  vi.mocked(fetchData).mockResolvedValue(mockData);

  render(<AsyncComponent />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### 3. Testing Error Handling

```typescript
test('should handle errors gracefully', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  // Trigger error condition
  const { result } = renderHook(() => useLocalStorage('test', 'default'));

  // Mock localStorage to throw
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage quota exceeded');
  });

  act(() => {
    result.current[1]('new value');
  });

  // Should not crash, state should still update
  expect(result.current[0]).toBe('new value');

  setItemSpy.mockRestore();
  consoleSpy.mockRestore();
});
```

### 4. Testing Conditional Rendering

```typescript
test('should render conditionally based on props', () => {
  const { rerender } = render(<Modal isOpen={false} />);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  rerender(<Modal isOpen={true} />);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

### 5. Testing Accessibility

```typescript
describe('Accessibility', () => {
  test('should have proper ARIA labels', () => {
    render(<Button onClick={() => {}}>Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  test('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button');

    button.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## Best Practices

### 1. Query Priority

Follow this priority when selecting elements (from React Testing Library docs):

1. **Accessible queries (preferred):**
   - `getByRole`
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`

2. **Semantic queries:**
   - `getByAltText`
   - `getByTitle`

3. **Test IDs (last resort):**
   - `getByTestId`

```typescript
// Good
const input = screen.getByLabelText('Email');
const button = screen.getByRole('button', { name: /submit/i });

// Avoid when possible
const element = screen.getByTestId('custom-element');
```

### 2. Async Testing

Always use `waitFor` or async user events for async operations:

```typescript
// Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Good
const user = userEvent.setup();
await user.click(button);

// Bad
await new Promise(resolve => setTimeout(resolve, 100));
```

### 3. Test Independence

Each test should be independent and not rely on other tests:

```typescript
// Good
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// Bad - tests depend on execution order
test('first test modifies state', () => {});
test('second test relies on first test state', () => {});
```

### 4. Avoid Implementation Details

Test behavior, not implementation:

```typescript
// Good - tests behavior
test('should display user name after submission', async () => {
  const user = userEvent.setup();
  render(<Form />);

  await user.type(screen.getByLabelText('Name'), 'John');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText('Hello, John')).toBeInTheDocument();
});

// Bad - tests implementation
test('should call setState when input changes', () => {
  const setStateSpy = vi.spyOn(React, 'useState');
  // ...
});
```

### 5. Descriptive Test Names

Use clear, descriptive test names that explain what is being tested:

```typescript
// Good
test('should display error message when email is invalid', () => {});
test('should call onSubmit with form data when form is submitted', () => {});

// Bad
test('test 1', () => {});
test('it works', () => {});
```

### 6. Test Coverage Goals

- **Statements:** 80%+ (achieved: 96.73%)
- **Branches:** 75%+ (achieved: 89.17%)
- **Functions:** 85%+ (achieved: 98.29%)
- **Lines:** 80%+ (achieved: 96.91%)

### 7. Edge Cases and Error Paths

Always test edge cases and error handling:

```typescript
describe('Edge Cases', () => {
  test('should handle null values', () => {});
  test('should handle empty strings', () => {});
  test('should handle very long input', () => {});
  test('should handle special characters', () => {});
});

describe('Error Handling', () => {
  test('should display error on network failure', () => {});
  test('should handle invalid JSON', () => {});
  test('should not crash on undefined props', () => {});
});
```

### 8. Performance Testing

For hooks with debouncing or performance optimizations:

```typescript
test('should debounce save operations', async () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useCVData(), { wrapper: CVProvider });

  act(() => {
    result.current.updatePersonalInfo({ firstName: 'John' });
    result.current.updatePersonalInfo({ firstName: 'Jane' });
    result.current.updatePersonalInfo({ firstName: 'Bob' });
  });

  // Fast-forward time
  act(() => {
    vi.advanceTimersByTime(2000);
  });

  // Should only save once after debounce
  expect(saveCVData).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- src/lib/__tests__/validation.test.ts
```

---

## Troubleshooting

### Common Issues

1. **"window is not defined" errors:**
   - Ensure vitest.config.ts has `environment: 'jsdom'`

2. **"Cannot find module" errors:**
   - Check path aliases in vitest.config.ts match tsconfig.json

3. **Async tests timing out:**
   - Increase timeout: `test('name', async () => {}, { timeout: 10000 })`
   - Use `waitFor` with appropriate timeout

4. **Tests passing locally but failing in CI:**
   - Ensure all mocks are properly cleaned up in `beforeEach`
   - Check for timing issues with async operations

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated:** 2026-01-11
**Project:** CV Generator
**Test Suite:** 416 tests, 96.73% coverage
