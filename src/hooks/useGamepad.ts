import { useState, useEffect } from "react";

interface UseGamepadReturn {
  gamepads: Gamepad[];
  connected: boolean;
}

/**
 * Returns {gamepads, connected} from the Gamepad API, updating on gamepadconnected/gamepaddisconnected events.
 *
 * @returns Object with gamepads array and connected boolean.
 */
export function useGamepad(): UseGamepadReturn {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);

  useEffect(() => {
    const update = () => {
      const list = Array.from(navigator.getGamepads()).filter(
        (g): g is Gamepad => g !== null
      );
      setGamepads(list);
    };

    window.addEventListener("gamepadconnected", update);
    window.addEventListener("gamepaddisconnected", update);
    return () => {
      window.removeEventListener("gamepadconnected", update);
      window.removeEventListener("gamepaddisconnected", update);
    };
  }, []);

  return { gamepads, connected: gamepads.length > 0 };
}
