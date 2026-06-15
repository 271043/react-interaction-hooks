import { useState, useEffect } from "react";

/**
 * Returns true if the user has enabled reduced motion in their OS accessibility settings.
 *
 * @returns boolean — matches (prefers-reduced-motion: reduce).
 */
export function useReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return matches;
}
