import { useEffect, useState, RefObject } from "react";

export function useScrollProgress<T extends HTMLElement>(ref?: RefObject<T>): number {
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
