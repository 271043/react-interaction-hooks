import { useState, useRef, useCallback } from "react";

interface UseCountdownReturn {
  count: number;
  running: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Counts down from initialSeconds using a 1-second interval, with start/stop/reset controls.
 *
 * @param initialSeconds - Starting countdown value in seconds.
 * @returns Object with count, running, start(), stop(), reset().
 */
export function useCountdown(initialSeconds: number): UseCountdownReturn {
  const [count, setCount] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          stop();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setCount(initialSeconds);
  }, [stop, initialSeconds]);

  return { count, running, start, stop, reset };
}
