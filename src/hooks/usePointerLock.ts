import { useState, useEffect, useCallback, RefObject } from "react";

interface UsePointerLockReturn {
  isLocked: boolean;
  lock: () => Promise<void>;
  unlock: () => void;
}

/**
 * Requests and manages the Pointer Lock API on the referenced element, returning lock/unlock controls.
 *
 * @param ref - RefObject attached to the element to lock pointer to.
 * @returns Object with isLocked boolean, lock() async function, unlock() function.
 */
export function usePointerLock<T extends HTMLElement>(
  ref: RefObject<T | null>
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
