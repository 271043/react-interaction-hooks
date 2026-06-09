import { useEffect, useRef, RefObject } from "react";

interface UseDoubleTapOptions {
  threshold?: number;
}

export function useDoubleTap<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (event: TouchEvent) => void,
  options: UseDoubleTapOptions = {}
): void {
  const { threshold = 300 } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const lastTap = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap.current < threshold) {
        callbackRef.current(e);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    };

    el.addEventListener("touchend", handleTap, { passive: true });
    return () => el.removeEventListener("touchend", handleTap);
  }, [ref, threshold]);
}
