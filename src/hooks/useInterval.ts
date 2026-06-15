import { useEffect, useRef } from "react";

/**
 * Runs callback every delay ms; stops when delay is null.
 *
 * @param callback - Called on each interval tick.
 * @param delay - Interval in ms, or null to pause.
 * @returns void
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
