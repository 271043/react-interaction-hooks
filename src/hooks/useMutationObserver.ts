import { useEffect, useRef } from "react";

/**
 * Calls callback whenever the DOM subtree of the referenced element mutates.
 *
 * @param ref - RefObject attached to the observed element.
 * @param callback - MutationCallback called with mutations list and observer.
 * @param options - MutationObserverInit (default: {childList:true, subtree:true}).
 * @returns void
 */
export function useMutationObserver(
  ref: React.RefObject<HTMLElement>,
  callback: MutationCallback,
  options: MutationObserverInit = { childList: true, subtree: true }
): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver((mutations, obs) =>
      savedCallback.current(mutations, obs)
    );
    observer.observe(el, options);
    return () => observer.disconnect();
  }, [ref, options]);
}
