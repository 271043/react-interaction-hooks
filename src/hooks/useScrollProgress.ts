import { useEffect, useState, RefObject } from "react";

/**
 * Returns a 0–1 value representing scroll progress of the window or a specific element.
 *
 * @param ref - Optional RefObject for an element; omit to use window scroll progress.
 * @returns number between 0 (top) and 1 (bottom).
 */
export function useScrollProgress<T extends HTMLElement>(ref?: RefObject<T | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref?.current ?? null;

    const handleScroll = () => {
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max <= 0 ? 1 : el.scrollTop / max);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max <= 0 ? 1 : window.scrollY / max);
      }
    };

    const target = el ?? window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}
