import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Returns the current {width, height} of the browser window, updated on resize.
 *
 * @returns Object with width and height matching window.innerWidth/innerHeight.
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
