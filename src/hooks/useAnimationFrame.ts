import { useEffect, useRef } from "react";

/**
 * Runs callback on every animation frame, passing the elapsed delta time in ms since last frame.
 *
 * @param callback - Called with deltaTime (ms) on each animation frame.
 * @returns void
 */
export function useAnimationFrame(callback: (deltaTime: number) => void): void {
  const savedCallback = useRef(callback);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const loop = (time: number) => {
      const delta = lastTimeRef.current !== null ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;
      savedCallback.current(delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}
