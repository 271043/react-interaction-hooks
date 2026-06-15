import { useEffect } from "react";

/**
 * Prevents body scrolling when locked is true; restores scroll position and styles on unlock.
 *
 * @param locked - When true, applies overflow:hidden + position:fixed to document.body.
 * @returns void
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const original = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    // iOS Safari requires position:fixed to prevent scroll bounce
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = original.overflow;
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
