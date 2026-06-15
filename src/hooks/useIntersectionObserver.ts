import { useEffect, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface IntersectionState {
  isIntersecting: boolean;
  ratio: number;
}

/**
 * Returns {isIntersecting, ratio} from an IntersectionObserver watching the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param options - Optional threshold, rootMargin, root.
 * @returns Object with isIntersecting boolean and ratio number.
 */
export function useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UseIntersectionObserverOptions = {}
): IntersectionState {
  const { threshold = 0, rootMargin = "0px", root = null } = options;
  const [state, setState] = useState<IntersectionState>({ isIntersecting: false, ratio: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState({ isIntersecting: entry.isIntersecting, ratio: entry.intersectionRatio });
      },
      { threshold, rootMargin, root }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, root]);

  return state;
}
