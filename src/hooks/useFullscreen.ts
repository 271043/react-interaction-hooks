import { useState, useEffect, useCallback, RefObject } from "react";

interface UseFullscreenReturn {
  isFullscreen: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
}

/**
 * Returns {isFullscreen, enter, exit, toggle} for managing the Fullscreen API on the referenced element.
 *
 * @param ref - RefObject attached to the element to fullscreen.
 * @returns Object with isFullscreen boolean, enter(), exit(), toggle() async functions.
 */
export function useFullscreen<T extends HTMLElement>(
  ref: RefObject<T>
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const enter = useCallback(async () => {
    await ref.current?.requestFullscreen();
  }, [ref]);

  const exit = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  }, []);

  const toggle = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await ref.current?.requestFullscreen();
  }, [ref]);

  return { isFullscreen, enter, exit, toggle };
}
