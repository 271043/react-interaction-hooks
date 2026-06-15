import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useBattery } from "./useBattery";

function BatteryDisplay() {
  const { supported, loading, level, charging, chargingTime, dischargingTime } = useBattery();
  return (
    <div>
      <span data-testid="supported">{String(supported)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="level">{level === null ? "null" : String(level)}</span>
      <span data-testid="charging">{charging === null ? "null" : String(charging)}</span>
      <span data-testid="chargingTime">{chargingTime === null ? "null" : String(chargingTime)}</span>
      <span data-testid="dischargingTime">{dischargingTime === null ? "null" : String(dischargingTime)}</span>
    </div>
  );
}

describe("useBattery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns supported false when getBattery not in navigator", () => {
    const navDescriptor = Object.getOwnPropertyDescriptor(navigator, "getBattery");
    if (navDescriptor) {
      Object.defineProperty(navigator, "getBattery", {
        value: undefined,
        configurable: true,
        writable: true,
      });
    }

    // Use a custom component that checks for absence of getBattery
    const original = (navigator as unknown as Record<string, unknown>).getBattery;
    delete (navigator as unknown as Record<string, unknown>).getBattery;

    render(<BatteryDisplay />);
    expect(screen.getByTestId("supported").textContent).toBe("false");

    if (original !== undefined) {
      (navigator as unknown as Record<string, unknown>).getBattery = original;
    }
  });

  it("sets level and charging after getBattery resolves", async () => {
    const mockBattery = {
      level: 0.8,
      charging: true,
      chargingTime: 1200,
      dischargingTime: Infinity,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "getBattery", {
      value: vi.fn().mockResolvedValue(mockBattery),
      configurable: true,
    });

    render(<BatteryDisplay />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId("supported").textContent).toBe("true");
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("level").textContent).toBe("0.8");
    expect(screen.getByTestId("charging").textContent).toBe("true");
    expect(screen.getByTestId("chargingTime").textContent).toBe("1200");
  });

  it("sets loading false after getBattery resolves", async () => {
    const mockBattery = {
      level: 0.5,
      charging: false,
      chargingTime: Infinity,
      dischargingTime: 3600,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "getBattery", {
      value: vi.fn().mockResolvedValue(mockBattery),
      configurable: true,
    });

    render(<BatteryDisplay />);
    expect(screen.getByTestId("loading").textContent).toBe("true");

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("updates on battery events", async () => {
    const eventListeners: Record<string, () => void> = {};
    const mockBattery = {
      level: 0.8,
      charging: true,
      chargingTime: 1200,
      dischargingTime: Infinity,
      addEventListener: vi.fn((event: string, fn: () => void) => {
        eventListeners[event] = fn;
      }),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "getBattery", {
      value: vi.fn().mockResolvedValue(mockBattery),
      configurable: true,
    });

    render(<BatteryDisplay />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId("level").textContent).toBe("0.8");

    act(() => {
      mockBattery.level = 0.5;
      eventListeners["levelchange"]?.();
    });

    expect(screen.getByTestId("level").textContent).toBe("0.5");
  });
});
