import { useEffect, useRef, RefObject } from "react";

interface UseDoubleClickOptions {
  threshold?: number;
}

/**
 * Calls callback on custom double-click (two clicks within threshold ms) on the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called with the MouseEvent on double-click.
 * @param options - Optional threshold in ms (default 300).
 * @returns void
 */
export function useDoubleClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
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
