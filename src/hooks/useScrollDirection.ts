import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down" | null;

export function useScrollDirection(): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y === lastY.current) return;
      setDirection(y > lastY.current ? "down" : "up");
      lastY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}
