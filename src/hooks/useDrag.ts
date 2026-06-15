import { useEffect, useRef, useState, RefObject } from "react";

interface DragState {
  isDragging: boolean;
  delta: { x: number; y: number };
  position: { x: number; y: number };
}

/**
 * Tracks mouse drag state (isDragging, delta, position) on the referenced element.
 *
 * @param ref - RefObject attached to the draggable element.
 * @returns Object with isDragging boolean, delta {x,y} from drag start, position {x,y} current pointer.
 */
export function useDrag<T extends HTMLElement>(ref: RefObject<T | null>): DragState {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    delta: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
  });

  const startPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleStart = (e: MouseEvent) => {
      startPos.current = { x: e.clientX, y: e.clientY };
      setState({ isDragging: true, delta: { x: 0, y: 0 }, position: { x: e.clientX, y: e.clientY } });
    };

    const handleMove = (e: MouseEvent) => {
      if (!startPos.current) return;
      setState({
        isDragging: true,
        delta: { x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y },
        position: { x: e.clientX, y: e.clientY },
      });
    };

    const handleEnd = () => {
      startPos.current = null;
      setState((prev) => ({ ...prev, isDragging: false }));
    };

    el.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    return () => {
      el.removeEventListener("mousedown", handleStart);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
    };
  }, [ref]);

  return state;
}
