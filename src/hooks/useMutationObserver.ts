import { useEffect, useRef } from "react";

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
