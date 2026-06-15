import { useState, useEffect, useRef } from "react";

/**
 * Returns the value, updating at most once every delay ms.
 *
 * @param value - The value to throttle.
 * @param delay - Throttle interval in ms.
 * @returns The throttled value.
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const remaining = delay - (Date.now() - lastRan.current);
    if (remaining <= 0) {
      setThrottled(value);
      lastRan.current = Date.now();
    } else {
      const timer = setTimeout(() => {
        setThrottled(value);
        lastRan.current = Date.now();
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttled;
}
