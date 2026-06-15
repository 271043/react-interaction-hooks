import { useEffect, useState } from "react";

interface NetworkStatus {
  online: boolean;
  type: string | null;
  effectiveType: string | null;
}

function getConnection() {
  return (
    (navigator as unknown as Record<string, unknown>).connection ??
    (navigator as unknown as Record<string, unknown>).mozConnection ??
    (navigator as unknown as Record<string, unknown>).webkitConnection ??
    null
  ) as { type?: string; effectiveType?: string; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void } | null;
}

/**
 * Returns {online, type, effectiveType} from navigator.onLine and the Network Information API.
 *
 * @returns Object with online boolean, type string|null, effectiveType string|null.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    const conn = getConnection();
    return {
      online: navigator.onLine,
      type: conn?.type ?? null,
      effectiveType: conn?.effectiveType ?? null,
    };
  });

  useEffect(() => {
    const conn = getConnection();

    const update = () => {
      setStatus({
        online: navigator.onLine,
        type: conn?.type ?? null,
        effectiveType: conn?.effectiveType ?? null,
      });
    };

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    conn?.addEventListener("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      conn?.removeEventListener("change", update);
    };
  }, []);

  return status;
}
