import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useWakeLock } from "./useWakeLock";

function WakeLockDisplay() {
  const { supported, active, request, release } = useWakeLock();
  return (
    <div>
      <span data-testid="supported">{String(supported)}</span>
      <span data-testid="active">{String(active)}</span>
      <button data-testid="request" onClick={request}>Request</button>
      <button data-testid="release" onClick={release}>Release</button>
    </div>
  );
}

describe("useWakeLock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns supported false when wakeLock not in navigator", () => {
    const original = (navigator as unknown as Record<string, unknown>).wakeLock;
    delete (navigator as unknown as Record<string, unknown>).wakeLock;

    render(<WakeLockDisplay />);
    expect(screen.getByTestId("supported").textContent).toBe("false");

    if (original !== undefined) {
      (navigator as unknown as Record<string, unknown>).wakeLock = original;
    }
  });

  it("calls navigator.wakeLock.request('screen') when request() is called", async () => {
    const mockSentinel = {
      release: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
    };
    const mockRequest = vi.fn().mockResolvedValue(mockSentinel);

    Object.defineProperty(navigator, "wakeLock", {
      value: { request: mockRequest },
      configurable: true,
    });

    render(<WakeLockDisplay />);

    await act(async () => {
      screen.getByTestId("request").click();
      await Promise.resolve();
    });

    expect(mockRequest).toHaveBeenCalledWith("screen");
  });

  it("sets active true after request() resolves", async () => {
    const mockSentinel = {
      release: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "wakeLock", {
      value: { request: vi.fn().mockResolvedValue(mockSentinel) },
      configurable: true,
    });

    render(<WakeLockDisplay />);
    expect(screen.getByTestId("active").textContent).toBe("false");

    await act(async () => {
      screen.getByTestId("request").click();
      await Promise.resolve();
    });

    expect(screen.getByTestId("active").textContent).toBe("true");
  });

  it("calls release() on the sentinel when release() is called", async () => {
    const mockRelease = vi.fn().mockResolvedValue(undefined);
    const mockSentinel = {
      release: mockRelease,
      addEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "wakeLock", {
      value: { request: vi.fn().mockResolvedValue(mockSentinel) },
      configurable: true,
    });

    render(<WakeLockDisplay />);

    await act(async () => {
      screen.getByTestId("request").click();
      await Promise.resolve();
    });

    await act(async () => {
      screen.getByTestId("release").click();
      await Promise.resolve();
    });

    expect(mockRelease).toHaveBeenCalled();
  });
});
