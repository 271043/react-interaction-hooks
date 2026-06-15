import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useRef } from "react";
import { useFullscreen } from "./useFullscreen";

function TestComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const { isFullscreen, enter, exit, toggle } = useFullscreen(ref);
  return (
    <div>
      <div ref={ref} data-testid="target" />
      <div data-testid="status">{String(isFullscreen)}</div>
      <button data-testid="enter" onClick={enter}>Enter</button>
      <button data-testid="exit" onClick={exit}>Exit</button>
      <button data-testid="toggle" onClick={toggle}>Toggle</button>
    </div>
  );
}

describe("useFullscreen", () => {
  beforeEach(() => {
    Object.defineProperty(document, "fullscreenElement", {
      get: vi.fn().mockReturnValue(null),
      configurable: true,
    });
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns isFullscreen as false initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("false");
  });

  it("enter() calls ref.current.requestFullscreen", async () => {
    render(<TestComponent />);
    const target = screen.getByTestId("target");
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    (target as HTMLDivElement & { requestFullscreen: typeof requestFullscreen }).requestFullscreen = requestFullscreen;

    await act(async () => {
      screen.getByTestId("enter").click();
    });

    expect(requestFullscreen).toHaveBeenCalledOnce();
  });

  it("exit() calls document.exitFullscreen", async () => {
    Object.defineProperty(document, "fullscreenElement", {
      get: vi.fn().mockReturnValue(document.body),
      configurable: true,
    });

    render(<TestComponent />);

    await act(async () => {
      screen.getByTestId("exit").click();
    });

    expect(document.exitFullscreen).toHaveBeenCalledOnce();
  });

  it("fullscreenchange event updates isFullscreen", async () => {
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("false");

    Object.defineProperty(document, "fullscreenElement", {
      get: vi.fn().mockReturnValue(document.body),
      configurable: true,
    });

    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(screen.getByTestId("status").textContent).toBe("true");

    Object.defineProperty(document, "fullscreenElement", {
      get: vi.fn().mockReturnValue(null),
      configurable: true,
    });

    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(screen.getByTestId("status").textContent).toBe("false");
  });
});
