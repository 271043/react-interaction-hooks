import { useCallback } from "react";

export function useVibrate(): (pattern: number | number[]) => void {
  return useCallback((pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);
}
