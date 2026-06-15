import { useEffect, useState } from "react";

/**
 * Returns true while the specified key is held down, false when released.
 *
 * @param targetKey - The key name to track (matches KeyboardEvent.key).
 * @returns boolean — true while the key is pressed.
 */
export function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(true);
    };
    const handleUp = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(false);
    };

    document.addEventListener("keydown", handleDown);
    document.addEventListener("keyup", handleUp);

    return () => {
      document.removeEventListener("keydown", handleDown);
      document.removeEventListener("keyup", handleUp);
    };
  }, [targetKey]);

  return pressed;
}
