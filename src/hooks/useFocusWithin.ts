import { useEffect, useState, RefObject } from "react";

/**
 * Returns true when any descendant of the referenced element currently has focus.
 *
 * @param ref - RefObject attached to the container element.
 * @returns boolean — true while focus is anywhere inside the element.
 */
export function useFocusWithin<T extends HTMLElement>(ref: RefObject<T | null>): boolean {
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleFocusIn = () => setIsFocusWithin(true);
    const handleFocusOut = (e: FocusEvent) => {
      // relatedTarget is where focus is going — if it's still inside, stay true
      if (!el.contains(e.relatedTarget as Node)) {
        setIsFocusWithin(false);
      }
    };

    el.addEventListener("focusin", handleFocusIn);
    el.addEventListener("focusout", handleFocusOut);

    return () => {
      el.removeEventListener("focusin", handleFocusIn);
      el.removeEventListener("focusout", handleFocusOut);
    };
  }, [ref]);

  return isFocusWithin;
}
