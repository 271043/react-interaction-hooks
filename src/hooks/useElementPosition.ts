import { useState, useEffect, useCallback, RefObject } from "react";

interface ElementPosition {
  x: number;
  y: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const INITIAL: ElementPosition = {
  x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0,
};

/**
 * Returns the DOMRect position (x, y, top, left, right, bottom, width, height) of the referenced element, updated on scroll and resize.
 *
 * @param ref - RefObject attached to the target element.
 * @returns Object with x, y, top, left, right, bottom, width, height (all 0 initially).
 */
export function useElementPosition<T extends HTMLElement>(
  ref: RefObject<T>
): ElementPosition {
  const [pos, setPos] = useState<ElementPosition>(INITIAL);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: r.x, y: r.y, top: r.top, left: r.left,
      right: r.right, bottom: r.bottom, width: r.width, height: r.height,
    });
  }, [ref]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [update]);

  return pos;
}
