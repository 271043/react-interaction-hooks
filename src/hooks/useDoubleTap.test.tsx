import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useDoubleTap } from "./useDoubleTap";

function DoubleTapTest({
  callback,
  threshold,
}: {
  callback: (e: TouchEvent) => void;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDoubleTap(ref, callback, threshold !== undefined ? { threshold } : {});
  return <div ref={ref} data-testid="target" />;
}

describe("useDoubleTap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls callback on two touchend events within threshold", () => {
    const callback = vi.fn();
    render(<DoubleTapTest callback={callback} threshold={300} />);
    const el = screen.getByTestId("target");

    fireEvent.touchEnd(el);
    // advance time by less than threshold
    act(() => { vi.advanceTimersByTime(200); });
    fireEvent.touchEnd(el);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback on a single tap", () => {
    const callback = vi.fn();
    render(<DoubleTapTest callback={callback} threshold={300} />);
    const el = screen.getByTestId("target");

    fireEvent.touchEnd(el);
    act(() => { vi.advanceTimersByTime(400); });

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call callback when second tap exceeds threshold", () => {
    const callback = vi.fn();
    render(<DoubleTapTest callback={callback} threshold={300} />);
    const el = screen.getByTestId("target");

    fireEvent.touchEnd(el);
    act(() => { vi.advanceTimersByTime(350); });
    fireEvent.touchEnd(el);

    expect(callback).not.toHaveBeenCalled();
  });
});
