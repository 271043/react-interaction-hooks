import { useState, useEffect, useRef, RefObject } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll(
  ref: RefObject<HTMLElement>,
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
