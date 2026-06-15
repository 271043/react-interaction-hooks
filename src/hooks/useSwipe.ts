import { useEffect, useRef, RefObject } from "react";

type SwipeDirection = "left" | "right" | "up" | "down";

interface UseSwipeOptions {
  threshold?: number;
  onSwipe: (direction: SwipeDirection) => void;
}

/**
 * Detects horizontal/vertical swipe direction on touch end for the referenced element.
 *
 * @param ref - RefObject attached to the swipe target.
 * @param options - onSwipe callback (required), optional threshold in px (default 50).
 * @returns void
 */
export function useSwipe<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseSwipeOptions
): void {
  const { threshold = 50, onSwipe } = options;
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;

  const startPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleEnd = (e: TouchEvent) => {
      if (!startPos.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startPos.current.x;
      const dy = touch.clientY - startPos.current.y;
      startPos.current = null;

      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipeRef.current(dx > 0 ? "right" : "left");
      } else {
        onSwipeRef.current(dy > 0 ? "down" : "up");
      }
    };

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchend", handleEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchend", handleEnd);
    };
  }, [ref, threshold]);
}
