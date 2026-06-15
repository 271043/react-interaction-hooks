import { useCallback, RefObject } from "react";

/**
 * Returns a function that calls scrollIntoView on the referenced element with the given options.
 *
 * @param ref - RefObject attached to the target element.
 * @param options - ScrollIntoViewOptions (default: smooth scroll to center).
 * @returns () => void — call to scroll element into view.
 */
export function useScrollIntoView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "center" }
): () => void {
  return useCallback(() => {
    ref.current?.scrollIntoView(options);
  }, [ref, options]);
}
