import { useState, useEffect, RefObject } from "react";

type BreakpointMap = Record<string, number>;

/**
 * Returns a map of breakpoint-name to boolean indicating whether the element width meets each breakpoint.
 *
 * @param ref - RefObject attached to the container element.
 * @param breakpoints - Record mapping breakpoint name to minimum width in px.
 * @returns Record<string, boolean> updated via ResizeObserver.
 */
export function useContainerQuery<T extends HTMLElement>(
  ref: RefObject<T>,
  breakpoints: BreakpointMap
): Record<string, boolean> {
  const [matches, setMatches] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.keys(breakpoints).map((k) => [k, false]))
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { width } = el.getBoundingClientRect();
      setMatches(
        Object.fromEntries(
          Object.entries(breakpoints).map(([k, minWidth]) => [k, width >= minWidth])
        )
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, breakpoints]);

  return matches;
}
