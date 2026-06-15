import { useState, useCallback } from "react";

interface UseCopyToClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Returns {copied, copy} — copy() writes text to the clipboard and sets copied=true for resetDelay ms.
 *
 * @param resetDelay - Ms before copied resets to false. Defaults to 2000.
 * @returns Object with copied boolean and copy(text) async function.
 */
export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    },
    [resetDelay]
  );

  return { copied, copy };
}
