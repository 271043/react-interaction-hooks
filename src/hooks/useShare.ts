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

export function useShare(): UseShareReturn {
  const supported = "share" in navigator;

  const share = useCallback(async (data: ShareData) => {
    if (!supported) return;
    await navigator.share(data);
  }, [supported]);

  return { supported, share };
}
