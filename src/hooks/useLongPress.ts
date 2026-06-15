import { useEffect, useRef, RefObject } from "react";

interface UseLongPressOptions {
  threshold?: number;
  onStart?: () => void;
  onCancel?: () => void;
}

/**
 * Calls callback when a pointer is held down for longer than threshold ms, on mouse and touch.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called after threshold ms of continuous press.
 * @param options - Optional threshold ms (default 500), onStart, onCancel callbacks.
 * @returns void
 */
export function useLongPress<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  options: UseLongPressOptions = {}
): void {
  const { threshold = 500, onStart, onCancel } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  // Keep latest callbacks in refs so the effect never needs to re-run for them
  const callbackRef = useRef(callback);
  const onStartRef = useRef(onStart);
  const onCancelRef = useRef(onCancel);
  callbackRef.current = callback;
  onStartRef.current = onStart;
  onCancelRef.current = onCancel;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleStart = () => {
      isLongPress.current = false;
      onStartRef.current?.();
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        callbackRef.current();
      }, threshold);
    };

    const handleCancel = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!isLongPress.current) {
        onCancelRef.current?.();
      }
    };

    el.addEventListener("mousedown", handleStart);
    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("mouseup", handleCancel);
    el.addEventListener("mouseleave", handleCancel);
    el.addEventListener("touchend", handleCancel);
    el.addEventListener("touchcancel", handleCancel);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      el.removeEventListener("mousedown", handleStart);
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("mouseup", handleCancel);
      el.removeEventListener("mouseleave", handleCancel);
      el.removeEventListener("touchend", handleCancel);
      el.removeEventListener("touchcancel", handleCancel);
    };
  }, [ref, threshold]); // callback อยู่ใน ref — ไม่ต้องใส่ dependency
}
