import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useState } from "react";
import { useThrottle } from "./useThrottle";

function TestComponent({ delay }: { delay: number }) {
  const [value, setValue] = useState("first");
  const throttled = useThrottle(value, delay);
  return (
    <div>
      <span data-testid="throttled">{throttled}</span>
      <button onClick={() => setValue("second")}>Second</button>
      <button onClick={() => setValue("third")}>Third</button>
    </div>
  );
}

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("passes the first value immediately", () => {
    render(<TestComponent delay={300} />);
    expect(screen.getByTestId("throttled").textContent).toBe("first");
  });

  it("ignores intermediate updates within the delay window", () => {
    render(<TestComponent delay={300} />);
    act(() => {
      screen.getByText("Second").click();
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => {
      screen.getByText("Third").click();
    });
    // The throttle window hasn't closed yet; still shows the last committed value
    expect(screen.getByTestId("throttled").textContent).toBe("first");
  });

  it("allows the next update after the delay has passed", () => {
    render(<TestComponent delay={300} />);
    act(() => {
      screen.getByText("Second").click();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => {
      screen.getByText("Third").click();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("throttled").textContent).toBe("third");
  });
});
