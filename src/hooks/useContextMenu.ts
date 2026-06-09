import { useEffect, useRef, RefObject } from "react";

export function useContextMenu<T extends HTMLElement>(
  ref: RefObject<T>,
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
