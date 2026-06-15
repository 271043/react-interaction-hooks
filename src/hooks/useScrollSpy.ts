import { useState, useEffect, RefObject } from "react";

interface UseScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Returns the index of the ref most visible in the viewport using IntersectionObserver.
 *
 * @param refs - Array of RefObjects to observe.
 * @param options - Optional threshold and rootMargin.
 * @returns number — index of currently intersecting ref (0 initially).
 */
export function useScrollSpy(
  refs: RefObject<HTMLElement>[],
  options: UseScrollSpyOptions = {}
): number {
  const { threshold = 0.5, rootMargin = "0px" } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.forEach((ref, index) => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { threshold, rootMargin }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [refs, threshold, rootMargin]);

  return activeIndex;
}
