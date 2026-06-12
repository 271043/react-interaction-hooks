import { useEffect, useRef, RefObject } from "react";

interface UseDoubleClickOptions {
  threshold?: number;
}

export function useDoubleClick<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (event: MouseEvent) => void,
  options: UseDoubleClickOptions = {}
): void {
  const { threshold = 300 } = options;
  const savedCallback = useRef(callback);
  const lastClick = useRef<number>(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastClick.current < threshold) {
        savedCallback.current(e);
        lastClick.current = 0;
      } else {
        lastClick.current = now;
      }
    };

    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [ref, threshold]);
}
