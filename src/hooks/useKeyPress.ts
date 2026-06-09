import { useEffect, useState } from "react";

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
