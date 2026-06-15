import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useState } from "react";
import { useTimeout } from "./useTimeout";

function TestComponent({
  callback,
  delay,
}: {
  callback: () => void;
  delay: number;
}) {
  const { reset, clear } = useTimeout(callback, delay);
  return (
    <div>
      <button onClick={reset}>Reset</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}

describe("useTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires callback after delay", () => {
    const callback = vi.fn();
    render(<TestComponent callback={callback} delay={1000} />);
    expect(callback).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("clear() prevents the callback from firing", () => {
    const callback = vi.fn();
    const { getByText } = render(<TestComponent callback={callback} delay={1000} />);
    act(() => {
      getByText("Clear").click();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("reset() restarts the timer", () => {
    const callback = vi.fn();
    const { getByText } = render(<TestComponent callback={callback} delay={1000} />);
    act(() => {
      vi.advanceTimersByTime(800);
    });
    act(() => {
      getByText("Reset").click();
    });
    act(() => {
      vi.advanceTimersByTime(800);
    });
    // Timer was reset so callback should not have fired yet
    expect(callback).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("callback updates without resetting the timer", () => {
    const first = vi.fn();
    const second = vi.fn();

    function Wrapper() {
      const [cb, setCb] = useState<() => void>(() => first);
      const { reset, clear } = useTimeout(cb, 500);
      return (
        <button onClick={() => setCb(() => second)}>Switch</button>
      );
    }

    const { getByText } = render(<Wrapper />);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => {
      getByText("Switch").click();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // The new callback should have been called (timer was not restarted by the cb switch)
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
