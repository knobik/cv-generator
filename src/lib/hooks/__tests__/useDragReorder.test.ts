import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragReorder } from '../useDragReorder';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRAF = vi.fn((cb: FrameRequestCallback) => {
  return 1;
});
const mockCAF = vi.fn();

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', mockRAF);
  vi.stubGlobal('cancelAnimationFrame', mockCAF);
  vi.stubGlobal('scrollBy', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

// Helper to create mock drag events
function createMockDragEvent(overrides: Partial<React.DragEvent> = {}): React.DragEvent {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    clientY: 300,
    dataTransfer: {
      effectAllowed: 'uninitialized',
      dropEffect: 'none',
      setData: vi.fn(),
    },
    ...overrides,
  } as unknown as React.DragEvent;
}

describe('useDragReorder', () => {
  const mockItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const mockOnReorder = vi.fn();

  beforeEach(() => {
    mockOnReorder.mockClear();
  });

  describe('initial state', () => {
    test('should return initial state with null indices', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      expect(result.current.draggedIndex).toBeNull();
      expect(result.current.dragOverIndex).toBeNull();
    });

    test('should return all required functions and refs', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      expect(result.current.handleDragStart).toBeInstanceOf(Function);
      expect(result.current.handleDragOver).toBeInstanceOf(Function);
      expect(result.current.handleDrop).toBeInstanceOf(Function);
      expect(result.current.handleDragEnd).toBeInstanceOf(Function);
      expect(result.current.handleContainerDragLeave).toBeInstanceOf(Function);
      expect(result.current.isDragging).toBeInstanceOf(Function);
      expect(result.current.getPlaceholderPosition).toBeInstanceOf(Function);
      expect(result.current.getDraggedItem).toBeInstanceOf(Function);
      expect(result.current.containerRef).toBeDefined();
    });
  });

  describe('handleDragStart', () => {
    test('should set draggedIndex to the provided index', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 2);
      });

      expect(result.current.draggedIndex).toBe(2);
    });

    test('should stop event propagation', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    test('should set dataTransfer effectAllowed to move', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
    });

    test('should start auto-scroll when enabled', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
          autoScroll: true,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      expect(mockRAF).toHaveBeenCalled();
    });

    test('should not start auto-scroll when disabled', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
          autoScroll: false,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      expect(mockRAF).not.toHaveBeenCalled();
    });
  });

  describe('handleDragOver', () => {
    test('should update dragOverIndex', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      act(() => {
        result.current.handleDragOver(mockEvent, 2);
      });

      expect(result.current.dragOverIndex).toBe(2);
    });

    test('should prevent default and stop propagation', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragOver(mockEvent, 1);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    test('should set dropEffect to move', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragOver(mockEvent, 1);
      });

      expect(mockEvent.dataTransfer.dropEffect).toBe('move');
    });
  });

  describe('handleDrop', () => {
    test('should call onReorder with correct indices', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      act(() => {
        result.current.handleDrop(mockEvent, 2);
      });

      expect(mockOnReorder).toHaveBeenCalledWith(0, 2);
    });

    test('should reset state after drop', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
        result.current.handleDragOver(mockEvent, 2);
      });

      act(() => {
        result.current.handleDrop(mockEvent, 2);
      });

      expect(result.current.draggedIndex).toBeNull();
      expect(result.current.dragOverIndex).toBeNull();
    });

    test('should not call onReorder when dropping on same index', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 1);
      });

      act(() => {
        result.current.handleDrop(mockEvent, 1);
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    test('should not call onReorder when draggedIndex is null', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDrop(mockEvent, 2);
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    test('should stop event propagation', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      const dropEvent = createMockDragEvent();
      act(() => {
        result.current.handleDrop(dropEvent, 2);
      });

      expect(dropEvent.stopPropagation).toHaveBeenCalled();
      expect(dropEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('handleDragEnd', () => {
    test('should reset all drag state', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
        result.current.handleDragOver(mockEvent, 2);
      });

      expect(result.current.draggedIndex).toBe(0);
      expect(result.current.dragOverIndex).toBe(2);

      act(() => {
        result.current.handleDragEnd(mockEvent);
      });

      expect(result.current.draggedIndex).toBeNull();
      expect(result.current.dragOverIndex).toBeNull();
    });

    test('should stop event propagation', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragEnd(mockEvent);
      });

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    test('should stop auto-scroll', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
          autoScroll: true,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      act(() => {
        result.current.handleDragEnd(mockEvent);
      });

      expect(mockCAF).toHaveBeenCalled();
    });
  });

  describe('isDragging', () => {
    test('should return true for dragged index', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 1);
      });

      expect(result.current.isDragging(1)).toBe(true);
      expect(result.current.isDragging(0)).toBe(false);
      expect(result.current.isDragging(2)).toBe(false);
    });

    test('should return false when not dragging', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      expect(result.current.isDragging(0)).toBe(false);
      expect(result.current.isDragging(1)).toBe(false);
    });
  });

  describe('getPlaceholderPosition', () => {
    test('should return "before" when dragging from higher to lower index', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 3);
        result.current.handleDragOver(mockEvent, 1);
      });

      expect(result.current.getPlaceholderPosition(1)).toBe('before');
    });

    test('should return "after" when dragging from lower to higher index', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
        result.current.handleDragOver(mockEvent, 2);
      });

      expect(result.current.getPlaceholderPosition(2)).toBe('after');
    });

    test('should return null for non-target indices', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
        result.current.handleDragOver(mockEvent, 2);
      });

      expect(result.current.getPlaceholderPosition(1)).toBeNull();
      expect(result.current.getPlaceholderPosition(3)).toBeNull();
    });

    test('should return null for dragged index', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 1);
        result.current.handleDragOver(mockEvent, 1);
      });

      expect(result.current.getPlaceholderPosition(1)).toBeNull();
    });

    test('should return null when not dragging', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      expect(result.current.getPlaceholderPosition(0)).toBeNull();
      expect(result.current.getPlaceholderPosition(1)).toBeNull();
    });
  });

  describe('getDraggedItem', () => {
    test('should return the item being dragged', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 2);
      });

      expect(result.current.getDraggedItem()).toBe('Item 3');
    });

    test('should return null when not dragging', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      expect(result.current.getDraggedItem()).toBeNull();
    });
  });

  describe('handleContainerDragLeave', () => {
    test('should clear dragOverIndex when leaving container', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
        })
      );

      // Mock containerRef
      const mockContainer = document.createElement('div');
      Object.defineProperty(result.current.containerRef, 'current', {
        value: mockContainer,
        writable: true,
      });

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
        result.current.handleDragOver(mockEvent, 2);
      });

      expect(result.current.dragOverIndex).toBe(2);

      // Simulate leaving to an element outside the container
      const outsideElement = document.createElement('div');
      const leaveEvent = createMockDragEvent({
        relatedTarget: outsideElement,
      });

      act(() => {
        result.current.handleContainerDragLeave(leaveEvent);
      });

      expect(result.current.dragOverIndex).toBeNull();
    });
  });

  describe('options', () => {
    test('should use custom scrollZoneHeight', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
          scrollZoneHeight: 200,
        })
      );

      expect(result.current).toBeDefined();
    });

    test('should use custom maxScrollSpeed', () => {
      const { result } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
          maxScrollSpeed: 50,
        })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('cleanup', () => {
    test('should cancel animation frame on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useDragReorder({
          items: mockItems,
          onReorder: mockOnReorder,
          autoScroll: true,
        })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragStart(mockEvent, 0);
      });

      unmount();

      expect(mockCAF).toHaveBeenCalled();
    });
  });
});
