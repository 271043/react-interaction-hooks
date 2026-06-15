import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useAnimationFrame } from "./useAnimationFrame";

function TestComponent({ callback }: { callback: (delta: number) => void }) {
  useAnimationFrame(callback);
  return <div />;
}

describe("useAnimationFrame", () => {
  let rafCallback: FrameRequestCallback | null = null;
  let rafId = 0;

  beforeEach(() => {
    rafCallback = null;
    rafId = 0;
    vi.stubGlobal("requestAnimationFrame", vi.fn((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return ++rafId;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls callback via requestAnimationFrame", () => {
    const callback = vi.fn();
    render(<TestComponent callback={callback} />);
    expect(requestAnimationFrame).toHaveBeenCalled();
    act(() => { rafCallback?.(16); });
    expect(callback).toHaveBeenCalled();
  });

  it("passes delta time to the callback", () => {
    const callback = vi.fn();
    render(<TestComponent callback={callback} />);
    // First frame: lastTimeRef is null so delta = 0
    act(() => { rafCallback?.(16); });
    const [deltaTime] = callback.mock.calls[0];
    expect(typeof deltaTime).toBe("number");
  });

  it("cancels the animation frame on unmount", () => {
    const callback = vi.fn();
    const { unmount } = render(<TestComponent callback={callback} />);
    act(() => { rafCallback?.(16); });
    act(() => {
      unmount();
    });
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
