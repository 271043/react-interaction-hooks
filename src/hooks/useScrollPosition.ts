import { useEffect, useState } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Returns the current window scroll position, updated on scroll.
 *
 * @returns Object with x (scrollX) and y (scrollY) — both 0 initially.
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setPosition({ x: window.scrollX, y: window.scrollY });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return position;
}
