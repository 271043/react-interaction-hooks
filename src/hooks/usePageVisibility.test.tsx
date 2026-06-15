import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { usePageVisibility } from "./usePageVisibility";

function TestComponent() {
  const isVisible = usePageVisibility();
  return <div data-testid="result">{String(isVisible)}</div>;
}

describe("usePageVisibility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true initially when document is not hidden", () => {
    Object.defineProperty(document, "hidden", {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    render(<TestComponent />);
    expect(screen.getByTestId("result").textContent).toBe("true");
  });

  it("returns false when visibilitychange fires with hidden=true", () => {
    Object.defineProperty(document, "hidden", {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    render(<TestComponent />);
    expect(screen.getByTestId("result").textContent).toBe("true");

    Object.defineProperty(document, "hidden", {
      get: vi.fn().mockReturnValue(true),
      configurable: true,
    });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(screen.getByTestId("result").textContent).toBe("false");
  });

  it("updates on each visibilitychange event", () => {
    Object.defineProperty(document, "hidden", {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    render(<TestComponent />);
    expect(screen.getByTestId("result").textContent).toBe("true");

    Object.defineProperty(document, "hidden", {
      get: vi.fn().mockReturnValue(true),
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(screen.getByTestId("result").textContent).toBe("false");

    Object.defineProperty(document, "hidden", {
      get: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(screen.getByTestId("result").textContent).toBe("true");
  });
});
