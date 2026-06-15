import { useEffect, useState } from "react";

/**
 * Returns true when the given CSS media query matches, updating on changes.
 *
 * @param query - CSS media query string (e.g. "(max-width: 768px)").
 * @returns boolean — true when the query matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mq.addEventListener("change", handler);
    setMatches(mq.matches);

    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
