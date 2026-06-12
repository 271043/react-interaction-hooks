import { useState, useEffect, useCallback, RefObject } from "react";

interface UsePointerLockReturn {
  isLocked: boolean;
  lock: () => Promise<void>;
  unlock: () => void;
}

export function usePointerLock<T extends HTMLElement>(
  ref: RefObject<T>
): UsePointerLockReturn {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const onLock = () => setIsLocked(!!document.pointerLockElement);
    const onError = () => setIsLocked(false);
    document.addEventListener("pointerlockchange", onLock);
    document.addEventListener("pointerlockerror", onError);
    return () => {
      document.removeEventListener("pointerlockchange", onLock);
      document.removeEventListener("pointerlockerror", onError);
    };
  }, []);

  const lock = useCallback(async () => {
    await ref.current?.requestPointerLock();
  }, [ref]);

  const unlock = useCallback(() => {
    if (document.pointerLockElement) document.exitPointerLock();
  }, []);

  return { isLocked, lock, unlock };
}
