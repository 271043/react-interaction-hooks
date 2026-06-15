import { useState, useEffect, useRef, RefObject } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Calls onLoadMore when the referenced sentinel element enters the viewport; returns loading state.
 *
 * @param ref - RefObject attached to the sentinel/trigger element.
 * @param onLoadMore - Async function called when sentinel intersects.
 * @param options - Optional threshold and rootMargin.
 * @returns Object with loading boolean.
 */
export function useInfiniteScroll(
  ref: RefObject<HTMLElement | null>,
  onLoadMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): { loading: boolean } {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const [loading, setLoading] = useState(false);
  const savedCallback = useRef(onLoadMore);

  useEffect(() => {
    savedCallback.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setLoading(true);
          await savedCallback.current();
          setLoading(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, loading, threshold, rootMargin]);

  return { loading };
}
