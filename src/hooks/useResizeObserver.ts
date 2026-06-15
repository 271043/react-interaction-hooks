import { useEffect, useState, RefObject } from "react";

interface Size {
  width: number;
  height: number;
}

/**
 * Returns {width, height} of the referenced element using ResizeObserver, updated on resize.
 *
 * @param ref - RefObject attached to the observed element.
 * @returns Object with width and height (both 0 initially).
 */
export function useResizeObserver<T extends HTMLElement>(ref: RefObject<T>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
