import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useVibrate } from "./useVibrate";

let capturedVibrate: ((pattern: number | number[]) => void) | null = null;

function VibrateCapture() {
  capturedVibrate = useVibrate();
  return null;
}

describe("useVibrate", () => {
  beforeEach(() => {
    capturedVibrate = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls navigator.vibrate with a number pattern when navigator.vibrate exists", () => {
    const mockVibrate = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      value: mockVibrate,
      configurable: true,
      writable: true,
    });

    render(<VibrateCapture />);

    act(() => {
      capturedVibrate!(200);
    });

    expect(mockVibrate).toHaveBeenCalledWith(200);
  });

  it("calls navigator.vibrate with an array pattern", () => {
    const mockVibrate = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      value: mockVibrate,
      configurable: true,
      writable: true,
    });

    render(<VibrateCapture />);

    act(() => {
      capturedVibrate!([200, 100, 200]);
    });

    expect(mockVibrate).toHaveBeenCalledWith([200, 100, 200]);
  });

  it("does not throw when navigator.vibrate is missing", () => {
    const original = (navigator as Record<string, unknown>).vibrate;
    delete (navigator as Record<string, unknown>).vibrate;

    render(<VibrateCapture />);

    expect(() => {
      act(() => {
        capturedVibrate!(200);
      });
    }).not.toThrow();

    if (original !== undefined) {
      (navigator as Record<string, unknown>).vibrate = original;
    }
  });
});
