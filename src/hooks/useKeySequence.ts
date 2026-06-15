import { useEffect, useRef } from "react";

/**
 * Calls callback when the exact sequence of keys is pressed in order.
 *
 * @param sequence - Array of key names to match in order (matches KeyboardEvent.key).
 * @param callback - Called when the full sequence is typed.
 * @returns void
 */
export function useKeySequence(sequence: string[], callback: () => void): void {
  const savedCallback = useRef(callback);
  const progress = useRef<number>(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === sequence[progress.current]) {
        progress.current += 1;
        if (progress.current === sequence.length) {
          savedCallback.current();
          progress.current = 0;
        }
      } else {
        progress.current = e.key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sequence]);
}
