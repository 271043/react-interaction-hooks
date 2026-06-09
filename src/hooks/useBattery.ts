import { useEffect, useState } from "react";

interface BatteryState {
  supported: boolean;
  loading: boolean;
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    supported: "getBattery" in navigator,
    loading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
  });

  useEffect(() => {
    if (!("getBattery" in navigator)) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    let battery: BatteryManager;

    const update = () => {
      setState({
        supported: true,
        loading: false,
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      });
    };

    (navigator as unknown as { getBattery: () => Promise<BatteryManager> })
      .getBattery()
      .then((b) => {
        battery = b;
        update();
        b.addEventListener("levelchange", update);
        b.addEventListener("chargingchange", update);
        b.addEventListener("chargingtimechange", update);
        b.addEventListener("dischargingtimechange", update);
      });

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", update);
        battery.removeEventListener("chargingchange", update);
        battery.removeEventListener("chargingtimechange", update);
        battery.removeEventListener("dischargingtimechange", update);
      }
    };
  }, []);

  return state;
}
