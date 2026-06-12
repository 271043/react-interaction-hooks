import { useState, useCallback } from "react";

interface EyeDropperInstance {
  open: () => Promise<{ sRGBHex: string }>;
}

interface EyeDropperConstructor {
  new (): EyeDropperInstance;
}

function getEyeDropper(): EyeDropperConstructor | undefined {
  return (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
}

interface UseEyeDropperReturn {
  supported: boolean;
  color: string | null;
  open: () => Promise<string | null>;
}

export function useEyeDropper(): UseEyeDropperReturn {
  const EyeDropper = getEyeDropper();
  const supported = !!EyeDropper;
  const [color, setColor] = useState<string | null>(null);

  const open = useCallback(async () => {
    if (!EyeDropper) return null;
    try {
      const result = await new EyeDropper().open();
      setColor(result.sRGBHex);
      return result.sRGBHex;
    } catch {
      return null;
    }
  }, [EyeDropper]);

  return { supported, color, open };
}
