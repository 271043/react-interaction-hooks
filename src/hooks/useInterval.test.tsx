import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useState } from "react";
import { useInterval } from "./useInterval";

function TestComponent({
  delay,
  callback,
}: {
  delay: number | null;
  callback: () => void;
}) {
  useInterval(callback, delay);
  return <div />;
}

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls callback after each interval tick", () => {
    const callback = vi.fn();
    render(<TestComponent delay={500} callback={callback} />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("does not call callback when delay is null", () => {
    const callback = vi.fn();
    render(<TestComponent delay={null} callback={callback} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("uses the updated callback without restarting the interval", () => {
    const first = vi.fn();
    const second = vi.fn();

    function Wrapper() {
      const [cb, setCb] = useState<() => void>(() => first);
      useInterval(cb, 200);
      return (
        <button onClick={() => setCb(() => second)}>Switch</button>
      );
    }

    const { getByText } = render(<Wrapper />);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(0);

    act(() => {
      getByText("Switch").click();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
