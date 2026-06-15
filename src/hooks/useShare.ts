import { useCallback } from "react";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface UseShareReturn {
  supported: boolean;
  share: (data: ShareData) => Promise<void>;
}

/**
 * Returns {supported, share} wrapping the Web Share API; share() is a no-op when unsupported.
 *
 * @returns Object with supported boolean and share(data) async function.
 */
export function useShare(): UseShareReturn {
  const supported = typeof navigator.share === "function";

  const share = useCallback(async (data: ShareData) => {
    if (!supported) return;
    await navigator.share(data);
  }, [supported]);

  return { supported, share };
}
