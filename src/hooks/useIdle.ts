import { useEffect, useState, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll", "wheel"] as const;

/**
 * Returns true when no user activity (mouse, keyboard, scroll, touch) has occurred for timeout ms.
 *
 * @param timeout - Inactivity duration in ms before considered idle.
 * @returns boolean — true when user has been idle for timeout ms.
 */
export function useIdle(timeout: number): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      setIsIdle(false);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsIdle(true), timeout);
    };

    ACTIVITY_EVENTS.forEach((event) => document.addEventListener(event, reset, { passive: true }));
    reset();

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => document.removeEventListener(event, reset));
    };
  }, [timeout]);

  return isIdle;
}
