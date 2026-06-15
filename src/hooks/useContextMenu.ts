import { useEffect, useRef, RefObject } from "react";

/**
 * Calls callback and prevents the default browser context menu on right-click of the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called with the MouseEvent on contextmenu event.
 * @returns void
 */
export function useContextMenu<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (event: MouseEvent) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      callbackRef.current(e);
    };

    el.addEventListener("contextmenu", handleContextMenu);
    return () => el.removeEventListener("contextmenu", handleContextMenu);
  }, [ref]);
}
