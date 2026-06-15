import { useEffect, useState } from "react";

interface PointerPosition {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
}

/**
 * Returns the current mouse pointer position as page coordinates and client coordinates.
 *
 * @returns Object with x (pageX), y (pageY), clientX, clientY — all 0 initially.
 */
export function usePointerPosition(): PointerPosition {
  const [position, setPosition] = useState<PointerPosition>({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.pageX, y: e.pageY, clientX: e.clientX, clientY: e.clientY });
    };

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
