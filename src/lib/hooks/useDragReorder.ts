import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseDragReorderOptions<T> {
  items: T[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  /**
   * Whether to enable auto-scroll when dragging near viewport edges.
   * @default true
   */
  autoScroll?: boolean;
  /**
   * Height of the scroll trigger zone at top/bottom of viewport in pixels.
   * @default 150
   */
  scrollZoneHeight?: number;
  /**
   * Maximum scroll speed in pixels per frame.
   * @default 25
   */
  maxScrollSpeed?: number;
}

export interface UseDragReorderReturn<T> {
  /** Index of the currently dragged item, or null if not dragging */
  draggedIndex: number | null;
  /** Index of the item being dragged over, or null */
  dragOverIndex: number | null;
  /** Whether a specific index is currently being dragged */
  isDragging: (index: number) => boolean;
  /** Get placeholder position for a specific index */
  getPlaceholderPosition: (index: number) => 'before' | 'after' | null;
  /** Get the item currently being dragged */
  getDraggedItem: () => T | null;
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLElement>;
  /** Handler for drag start event */
  handleDragStart: (e: React.DragEvent, index: number) => void;
  /** Handler for drag over event */
  handleDragOver: (e: React.DragEvent, index: number) => void;
  /** Handler for drop event */
  handleDrop: (e: React.DragEvent, index: number) => void;
  /** Handler for drag end event */
  handleDragEnd: (e: React.DragEvent) => void;
  /** Handler for container drag leave event */
  handleContainerDragLeave: (e: React.DragEvent) => void;
}

/**
 * Custom hook for drag and drop reordering functionality.
 *
 * @example
 * ```tsx
 * const {
 *   containerRef,
 *   handleDragStart,
 *   handleDragOver,
 *   handleDrop,
 *   handleDragEnd,
 *   handleContainerDragLeave,
 *   isDragging,
 *   getPlaceholderPosition
 * } = useDragReorder({
 *   items: myItems,
 *   onReorder: (from, to) => reorderItems(from, to),
 * });
 * ```
 */
export function useDragReorder<T>({
  items,
  onReorder,
  autoScroll = true,
  scrollZoneHeight = 150,
  maxScrollSpeed = 25,
}: UseDragReorderOptions<T>): UseDragReorderReturn<T> {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const mouseYRef = useRef<number>(0);

  // Auto-scroll loop
  const scrollLoop = useCallback(() => {
    if (!autoScroll) return;

    const clientY = mouseYRef.current;
    const scrollZoneTop = scrollZoneHeight;
    const scrollZoneBottom = window.innerHeight - scrollZoneHeight;

    if (clientY < scrollZoneTop) {
      const intensity = (scrollZoneTop - clientY) / scrollZoneHeight;
      window.scrollBy({ top: -maxScrollSpeed * intensity, behavior: 'instant' });
    } else if (clientY > scrollZoneBottom) {
      const intensity = (clientY - scrollZoneBottom) / scrollZoneHeight;
      window.scrollBy({ top: maxScrollSpeed * intensity, behavior: 'instant' });
    }

    scrollAnimationRef.current = requestAnimationFrame(scrollLoop);
  }, [autoScroll, scrollZoneHeight, maxScrollSpeed]);

  const startAutoScroll = useCallback(() => {
    if (!autoScroll) return;
    if (!scrollAnimationRef.current) {
      scrollAnimationRef.current = requestAnimationFrame(scrollLoop);
    }
  }, [autoScroll, scrollLoop]);

  const stopAutoScroll = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAutoScroll();
  }, [stopAutoScroll]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.stopPropagation();
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
      mouseYRef.current = e.clientY;
      startAutoScroll();
    },
    [startAutoScroll]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverIndex !== index) {
        setDragOverIndex(index);
      }
      mouseYRef.current = e.clientY;
    },
    [dragOverIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      stopAutoScroll();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      onReorder(draggedIndex, dropIndex);
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, onReorder, stopAutoScroll]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      e.stopPropagation();
      stopAutoScroll();
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [stopAutoScroll]
  );

  const handleContainerDragLeave = useCallback((e: React.DragEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  }, []);

  const isDragging = useCallback(
    (index: number) => {
      return draggedIndex === index;
    },
    [draggedIndex]
  );

  const getPlaceholderPosition = useCallback(
    (index: number): 'before' | 'after' | null => {
      if (draggedIndex === null || dragOverIndex === null) return null;
      if (dragOverIndex !== index) return null;
      if (draggedIndex === index) return null;

      return draggedIndex > index ? 'before' : 'after';
    },
    [draggedIndex, dragOverIndex]
  );

  const getDraggedItem = useCallback((): T | null => {
    if (draggedIndex === null) return null;
    return items[draggedIndex] ?? null;
  }, [draggedIndex, items]);

  return {
    draggedIndex,
    dragOverIndex,
    isDragging,
    getPlaceholderPosition,
    getDraggedItem,
    containerRef: containerRef as React.RefObject<HTMLElement>,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleContainerDragLeave,
  };
}
