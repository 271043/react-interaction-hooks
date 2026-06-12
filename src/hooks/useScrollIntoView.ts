import { useCallback, RefObject } from "react";

export function useScrollIntoView<T extends HTMLElement>(
  ref: RefObject<T>,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "center" }
): () => void {
  return useCallback(() => {
    ref.current?.scrollIntoView(options);
  }, [ref, options]);
}
