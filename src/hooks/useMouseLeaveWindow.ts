import { useEffect, useRef } from "react";

/**
 * Calls callback when the mouse pointer exits the browser viewport (relatedTarget === null).
 *
 * @param callback - Called when the pointer leaves the browser window.
 * @returns void
 */
export function useMouseLeaveWindow(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // relatedTarget is null when pointer exits the browser viewport entirely
      if (e.relatedTarget === null) {
        callbackRef.current();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);
}
