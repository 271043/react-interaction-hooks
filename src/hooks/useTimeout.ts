import { useEffect, useRef, useCallback } from "react";

/**
 * Fires callback once after delay ms; returns reset() to restart and clear() to cancel.
 *
 * @param callback - Called after delay ms.
 * @param delay - Delay in ms before callback fires.
 * @returns Object with reset() and clear() functions.
 */
export function useTimeout(
  callback: () => void,
  delay: number
): { reset: () => void; clear: () => void } {
  const savedCallback = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    timerRef.current = setTimeout(() => savedCallback.current(), delay);
  }, [clear, delay]);

  useEffect(() => {
    reset();
    return clear;
  }, [reset, clear]);

  return { reset, clear };
}
