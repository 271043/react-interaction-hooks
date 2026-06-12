import { useEffect, useRef } from "react";

export function useFocusReturn(): void {
  const returnRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnRef.current = document.activeElement as HTMLElement;
    return () => {
      returnRef.current?.focus();
    };
  }, []);
}
