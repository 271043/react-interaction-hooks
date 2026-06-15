import { useEffect, useRef } from "react";

/**
 * Calls callback with pasted text whenever a paste event fires on the document.
 *
 * @param callback - Called with (text, ClipboardEvent) when text is pasted.
 * @returns void
 */
export function usePaste(callback: (text: string, event: ClipboardEvent) => void): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text") ?? "";
      savedCallback.current(text, e);
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, []);
}
