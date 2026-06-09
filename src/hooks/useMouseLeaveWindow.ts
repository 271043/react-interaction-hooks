import { useEffect, useRef } from "react";

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
