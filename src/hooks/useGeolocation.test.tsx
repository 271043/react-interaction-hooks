import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useGeolocation } from "./useGeolocation";

const mockPosition = {
  coords: {
    latitude: 51.5074,
    longitude: -0.1278,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
} as GeolocationPosition;

function GeolocationDisplay() {
  const { loading, position, error } = useGeolocation();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="position">{position ? "has-position" : "null"}</span>
      <span data-testid="error">{error ? "has-error" : "null"}</span>
    </div>
  );
}

describe("useGeolocation", () => {
  const mockWatchPosition = vi.fn();
  const mockClearWatch = vi.fn();

  beforeEach(() => {
    mockWatchPosition.mockReset();
    mockClearWatch.mockReset();

    Object.defineProperty(navigator, "geolocation", {
      value: {
        watchPosition: mockWatchPosition,
        clearWatch: mockClearWatch,
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with loading true", () => {
    mockWatchPosition.mockImplementation(() => 1);
    render(<GeolocationDisplay />);
    expect(screen.getByTestId("loading").textContent).toBe("true");
  });

  it("sets loading false and position after success callback", () => {
    mockWatchPosition.mockImplementation((success) => {
      success(mockPosition);
      return 1;
    });

    render(<GeolocationDisplay />);
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("position").textContent).toBe("has-position");
    expect(screen.getByTestId("error").textContent).toBe("null");
  });

  it("sets loading false and error after error callback", () => {
    const mockError = { code: 1, message: "Permission denied" } as GeolocationPositionError;
    mockWatchPosition.mockImplementation((_success, error) => {
      error(mockError);
      return 1;
    });

    render(<GeolocationDisplay />);
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("position").textContent).toBe("null");
    expect(screen.getByTestId("error").textContent).toBe("has-error");
  });

  it("calls clearWatch on unmount", () => {
    mockWatchPosition.mockImplementation(() => 42);

    const { unmount } = render(<GeolocationDisplay />);
    unmount();

    expect(mockClearWatch).toHaveBeenCalledWith(42);
  });
});
