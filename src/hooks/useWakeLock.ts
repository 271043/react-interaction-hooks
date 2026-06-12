import { useState, useEffect, useCallback } from "react";

interface UseWakeLockReturn {
  supported: boolean;
  active: boolean;
  request: () => Promise<void>;
  release: () => Promise<void>;
}

export function useWakeLock(): UseWakeLockReturn {
  const supported = "wakeLock" in navigator;
  const [active, setActive] = useState(false);
  const lockRef = { current: null as WakeLockSentinel | null };

  const request = useCallback(async () => {
    if (!supported) return;
    try {
      lockRef.current = await (navigator as Navigator & { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request("screen");
      lockRef.current.addEventListener("release", () => setActive(false));
      setActive(true);
    } catch {
      setActive(false);
    }
  }, [supported]);

  const release = useCallback(async () => {
    await lockRef.current?.release();
    lockRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => {
    const reacquire = () => { if (active) request(); };
    document.addEventListener("visibilitychange", reacquire);
    return () => document.removeEventListener("visibilitychange", reacquire);
  }, [active, request]);

  return { supported, active, request, release };
}
