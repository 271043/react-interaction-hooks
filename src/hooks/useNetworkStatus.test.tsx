import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useNetworkStatus } from "./useNetworkStatus";

function NetworkStatusDisplay() {
  const { online, type, effectiveType } = useNetworkStatus();
  return (
    <div>
      <span data-testid="online">{String(online)}</span>
      <span data-testid="type">{type ?? "null"}</span>
      <span data-testid="effectiveType">{effectiveType ?? "null"}</span>
    </div>
  );
}

describe("useNetworkStatus", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", {
      get: vi.fn().mockReturnValue(true),
      configurable: true,
    });
    Object.defineProperty(navigator, "connection", {
      get: vi.fn().mockReturnValue({
        type: "wifi",
        effectiveType: "4g",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reflects navigator.onLine as online", () => {
    render(<NetworkStatusDisplay />);
    expect(screen.getByTestId("online").textContent).toBe("true");
  });

  it("reads type and effectiveType from navigator.connection", () => {
    render(<NetworkStatusDisplay />);
    expect(screen.getByTestId("type").textContent).toBe("wifi");
    expect(screen.getByTestId("effectiveType").textContent).toBe("4g");
  });

  it("updates online to false when window offline event fires", () => {
    render(<NetworkStatusDisplay />);
    expect(screen.getByTestId("online").textContent).toBe("true");

    Object.defineProperty(navigator, "onLine", {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByTestId("online").textContent).toBe("false");
  });

  it("updates online to true when window online event fires", () => {
    Object.defineProperty(navigator, "onLine", {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });

    render(<NetworkStatusDisplay />);
    expect(screen.getByTestId("online").textContent).toBe("false");

    Object.defineProperty(navigator, "onLine", {
      get: vi.fn().mockReturnValue(true),
      configurable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.getByTestId("online").textContent).toBe("true");
  });
});
