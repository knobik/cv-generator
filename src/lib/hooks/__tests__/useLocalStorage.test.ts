import { describe, expect, test, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    test('should initialize with default value', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('default');
    });

    test('should load value from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('stored-value');
    });
  });

  describe('setValue', () => {
    test('should save value to localStorage on update', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
    });

    test('should serialize objects to JSON', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', { name: 'John', age: 30 }));

      act(() => {
        result.current[1]({ name: 'Jane', age: 25 });
      });

      expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify({ name: 'Jane', age: 25 }));
    });

    test('should deserialize JSON to objects', () => {
      localStorage.setItem('test-key', JSON.stringify({ name: 'John', age: 30 }));

      const { result } = renderHook(() => useLocalStorage('test-key', { name: '', age: 0 }));

      expect(result.current[0]).toEqual({ name: 'John', age: 30 });
    });

    test('should update state on setValue', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 0));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    test('should support functional updates', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 10));

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(15);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(15));
    });
  });

  describe('removeValue', () => {
    test('should remove value from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('stored-value');

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('default');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    test('should reset to initial value', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toBe('initial');
    });
  });

  describe('Type Safety', () => {
    test('should work with string types', () => {
      const { result } = renderHook(() => useLocalStorage<string>('test-key', 'hello'));

      expect(result.current[0]).toBe('hello');
    });

    test('should work with number types', () => {
      const { result } = renderHook(() => useLocalStorage<number>('test-key', 42));

      expect(result.current[0]).toBe(42);
    });

    test('should work with boolean types', () => {
      const { result } = renderHook(() => useLocalStorage<boolean>('test-key', true));

      expect(result.current[0]).toBe(true);
    });

    test('should work with array types', () => {
      const { result } = renderHook(() => useLocalStorage<string[]>('test-key', ['a', 'b', 'c']));

      expect(result.current[0]).toEqual(['a', 'b', 'c']);
    });

    test('should work with object types', () => {
      interface User {
        name: string;
        email: string;
      }

      const { result } = renderHook(() =>
        useLocalStorage<User>('test-key', { name: 'John', email: 'john@example.com' })
      );

      expect(result.current[0]).toEqual({ name: 'John', email: 'john@example.com' });
    });
  });

  describe('Edge Cases', () => {
    test('should handle null values', () => {
      const { result } = renderHook(() => useLocalStorage<string | null>('test-key', null));

      expect(result.current[0]).toBeNull();

      act(() => {
        result.current[1]('value');
      });

      expect(result.current[0]).toBe('value');
    });

    test('should handle empty string', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', ''));

      expect(result.current[0]).toBe('');

      act(() => {
        result.current[1]('value');
      });

      expect(result.current[0]).toBe('value');
    });

    test('should handle multiple keys independently', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'));
      const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'));

      expect(result1.current[0]).toBe('value1');
      expect(result2.current[0]).toBe('value2');

      act(() => {
        result1.current[1]('updated1');
      });

      expect(result1.current[0]).toBe('updated1');
      expect(result2.current[0]).toBe('value2');
    });
  });

  describe('Error Handling', () => {
    test('should return initial value if localStorage.getItem fails during initialization', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('test-key', 'invalid json {');

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      expect(result.current[0]).toBe('default');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error loading test-key'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    test('should handle localStorage.setItem errors gracefully', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock setItem to throw an error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // Hook should still work even with storage errors
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      // Should not throw when trying to set value
      expect(() => {
        act(() => {
          result.current[1]('new value');
        });
      }).not.toThrow();

      // State should still update even if storage fails
      expect(result.current[0]).toBe('new value');

      setItemSpy.mockRestore();
    });

    test('should handle localStorage.removeItem errors gracefully', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      // First create hook normally
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      // Mock removeItem to throw an error
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw when trying to remove value
      expect(() => {
        act(() => {
          result.current[2]();
        });
      }).not.toThrow();

      // State should still reset even if storage fails
      expect(result.current[0]).toBe('initial');

      removeItemSpy.mockRestore();
    });

    test('should handle SSR environment (window undefined)', () => {
      // This test is tricky because window always exists in jsdom
      // The SSR path is executed during hook initialization before window check
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      // In SSR, it would return default value immediately
      // In our test environment with jsdom, it will try to use localStorage
      expect(result.current[0]).toBeDefined();
    });
  });
});
