import { useEffect, useRef, RefObject } from "react";

interface PinchState {
  scale: number;
  origin: { x: number; y: number };
}

interface UsePinchOptions {
  onPinch: (state: PinchState) => void;
  onPinchEnd?: (state: PinchState) => void;
}

function getDistance(t1: Touch, t2: Touch): number {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function getMidpoint(t1: Touch, t2: Touch) {
  return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
}

export function usePinch<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UsePinchOptions
): void {
  const { onPinch, onPinchEnd } = options;
  const onPinchRef = useRef(onPinch);
  const onPinchEndRef = useRef(onPinchEnd);
  onPinchRef.current = onPinch;
  onPinchEndRef.current = onPinchEnd;

  const initialDistance = useRef<number | null>(null);
  const lastState = useRef<PinchState | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    };

    const handleMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || initialDistance.current === null) return;
      const scale = getDistance(e.touches[0], e.touches[1]) / initialDistance.current;
      const origin = getMidpoint(e.touches[0], e.touches[1]);
      lastState.current = { scale, origin };
      onPinchRef.current(lastState.current);
    };

    const handleEnd = () => {
      if (initialDistance.current === null) return;
      initialDistance.current = null;
      if (lastState.current) {
        onPinchEndRef.current?.(lastState.current);
        lastState.current = null;
      }
    };

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, [ref]);
}
