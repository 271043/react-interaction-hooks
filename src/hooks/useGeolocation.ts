import { useEffect, useState } from "react";

interface GeolocationState {
  loading: boolean;
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Returns {loading, position, error} from the Geolocation API watchPosition, updating on location changes.
 *
 * @param options - GeolocationPositionOptions (enableHighAccuracy, timeout, maximumAge).
 * @returns Object with loading boolean, position GeolocationPosition|null, error GeolocationPositionError|null.
 */
export function useGeolocation(options: UseGeolocationOptions = {}): GeolocationState {
  const { enableHighAccuracy = false, timeout = Infinity, maximumAge = 0 } = options;

  const [state, setState] = useState<GeolocationState>({
    loading: true,
    position: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, position: null, error: null });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => setState({ loading: false, position, error: null }),
      (error) => setState({ loading: false, position: null, error }),
      { enableHighAccuracy, timeout, maximumAge }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [enableHighAccuracy, timeout, maximumAge]);

  return state;
}
