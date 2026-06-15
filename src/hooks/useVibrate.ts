import { useCallback } from "react";

/**
 * Returns a function that triggers device vibration via the Vibration API; no-op when unsupported.
 *
 * @returns (pattern: number | number[]) => void
 */
export function useVibrate(): (pattern: number | number[]) => void {
  return useCallback((pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);
}
