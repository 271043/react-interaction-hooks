import { useEffect, RefObject } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * Calls handler when a click or touch occurs outside the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param handler - Called with the MouseEvent or TouchEvent when outside click is detected.
 * @param enabled - When false, disables the listener. Defaults to true.
 * @returns void
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: Handler,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
