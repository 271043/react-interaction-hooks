import { useState, useEffect } from "react";

/**
 * Returns true when the user is navigating with the keyboard (Tab key was last used), false after mouse interaction.
 *
 * @returns boolean — true after Tab keydown, false after mousedown.
 */
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
