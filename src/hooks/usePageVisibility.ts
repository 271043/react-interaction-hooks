import { useEffect, useState } from "react";

/**
 * Returns true when the browser tab is visible (document.hidden is false).
 *
 * @returns boolean — true when tab is visible.
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const handleChange = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleChange);
    return () => document.removeEventListener("visibilitychange", handleChange);
  }, []);

  return isVisible;
}
