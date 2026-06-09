import { useState, useCallback } from "react";

interface UseCopyToClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

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
