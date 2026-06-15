import { useEffect, useRef } from "react";

/**
 * Saves the currently focused element on mount and restores focus to it on unmount.
 *
 * @returns void
 */
export function useFocusReturn(): void {
  const returnRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnRef.current = document.activeElement as HTMLElement;
    return () => {
      returnRef.current?.focus();
    };
  }, []);
}
