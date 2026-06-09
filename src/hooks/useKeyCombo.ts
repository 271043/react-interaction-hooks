import { useEffect, useCallback } from "react";

type ModifierKey = "ctrl" | "shift" | "alt" | "meta";

interface UseKeyComboOptions {
  enabled?: boolean;
  target?: HTMLElement | Document | null;
}

function parseCombo(combo: string): { modifiers: Set<ModifierKey>; key: string } {
  const parts = combo.toLowerCase().split("+");
  const modifiers = new Set<ModifierKey>();
  const validModifiers = new Set(["ctrl", "shift", "alt", "meta"]);

  let key = "";
  for (const part of parts) {
    if (validModifiers.has(part)) {
      modifiers.add(part as ModifierKey);
    } else {
      key = part;
    }
  }
  return { modifiers, key };
}

export function useKeyCombo(
  combo: string,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyComboOptions = {}
): void {
  const { enabled = true, target = document } = options;

  const handler = useCallback(
    (event: Event) => {
      const e = event as KeyboardEvent;
      const { modifiers, key } = parseCombo(combo);

      const pressed =
        e.key.toLowerCase() === key &&
        e.ctrlKey === modifiers.has("ctrl") &&
        e.shiftKey === modifiers.has("shift") &&
        e.altKey === modifiers.has("alt") &&
        e.metaKey === modifiers.has("meta");

      if (pressed) callback(e);
    },
    [combo, callback]
  );

  useEffect(() => {
    if (!enabled || !target) return;
    target.addEventListener("keydown", handler);
    return () => target.removeEventListener("keydown", handler);
  }, [enabled, target, handler]);
}
