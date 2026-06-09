import { useEffect, useRef, useState, RefObject } from "react";

interface UseHoverOptions {
  enterDelay?: number;
  leaveDelay?: number;
}

export function useHover<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UseHoverOptions = {}
): boolean {
  const { enterDelay = 0, leaveDelay = 0 } = options;
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleEnter = () => {
      clearTimer();
      if (enterDelay > 0) {
        timerRef.current = setTimeout(() => setIsHovered(true), enterDelay);
      } else {
        setIsHovered(true);
      }
    };

    const handleLeave = () => {
      clearTimer();
      if (leaveDelay > 0) {
        timerRef.current = setTimeout(() => setIsHovered(false), leaveDelay);
      } else {
        setIsHovered(false);
      }
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      clearTimer();
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, enterDelay, leaveDelay]);

  return isHovered;
}
