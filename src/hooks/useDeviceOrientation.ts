import { useEffect, useState } from "react";

interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

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
