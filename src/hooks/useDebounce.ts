import { useState, useEffect } from "react";

/**
 * Returns the value after it has not changed for delay ms.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in ms.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
