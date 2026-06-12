import { useState, useEffect } from "react";

export function useTabFocus(): boolean {
  const [isTabFocused, setIsTabFocused] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") setIsTabFocused(true);
    };
    const onMouseDown = () => setIsTabFocused(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return isTabFocused;
}
