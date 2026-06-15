import { useState, useEffect, RefObject } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Returns {width, height} of the referenced element via ResizeObserver and getBoundingClientRect, updated on resize.
 *
 * @param ref - RefObject attached to the target element.
 * @returns Object with width and height (both 0 initially).
 */
export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
