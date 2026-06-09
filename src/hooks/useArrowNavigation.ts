import { useEffect, RefObject } from "react";

interface UseArrowNavigationOptions {
  selector?: string;
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
}

export function useArrowNavigation<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UseArrowNavigationOptions = {}
): void {
  const {
    selector = "[role='option'], [role='menuitem'], li, button",
    orientation = "vertical",
    loop = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
      if (!items.length) return;

      const index = items.indexOf(document.activeElement as HTMLElement);
      const isVertical = orientation === "vertical" || orientation === "both";
      const isHorizontal = orientation === "horizontal" || orientation === "both";

      let next = -1;

      if (isVertical && e.key === "ArrowDown") {
        next = index < items.length - 1 ? index + 1 : loop ? 0 : index;
      } else if (isVertical && e.key === "ArrowUp") {
        next = index > 0 ? index - 1 : loop ? items.length - 1 : index;
      } else if (isHorizontal && e.key === "ArrowRight") {
        next = index < items.length - 1 ? index + 1 : loop ? 0 : index;
      } else if (isHorizontal && e.key === "ArrowLeft") {
        next = index > 0 ? index - 1 : loop ? items.length - 1 : index;
      }

      if (next !== -1) {
        e.preventDefault();
        items[next].focus();
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [ref, selector, orientation, loop]);
}
