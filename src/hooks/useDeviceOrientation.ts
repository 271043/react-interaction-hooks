import { useEffect, useState } from "react";

interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

/**
 * Returns {alpha, beta, gamma} from the DeviceOrientation API, updating on each orientation event.
 *
 * @returns Object with alpha, beta, gamma (all null initially).
 */
export function useDeviceOrientation(): DeviceOrientationState {
  const [orientation, setOrientation] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  return orientation;
}
