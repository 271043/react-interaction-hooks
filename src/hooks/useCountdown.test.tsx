import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

function TestComponent({ initialSeconds }: { initialSeconds: number }) {
  const { count, running, start, stop, reset } = useCountdown(initialSeconds);
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="running">{running ? "running" : "stopped"}</span>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("count starts at initialSeconds", () => {
    render(<TestComponent initialSeconds={10} />);
    expect(screen.getByTestId("count").textContent).toBe("10");
  });

  it("running is false initially", () => {
    render(<TestComponent initialSeconds={10} />);
    expect(screen.getByTestId("running").textContent).toBe("stopped");
  });

  it("start() begins the countdown and running becomes true", () => {
    render(<TestComponent initialSeconds={10} />);
    act(() => {
      screen.getByText("Start").click();
    });
    expect(screen.getByTestId("running").textContent).toBe("running");
  });

  it("count decrements each second", () => {
    render(<TestComponent initialSeconds={5} />);
    act(() => {
      screen.getByText("Start").click();
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("count").textContent).toBe("3");
  });

  it("stops at 0 and running becomes false", () => {
    render(<TestComponent initialSeconds={3} />);
    act(() => {
      screen.getByText("Start").click();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("running").textContent).toBe("stopped");
  });

  it("stop() pauses the countdown", () => {
    render(<TestComponent initialSeconds={10} />);
    act(() => {
      screen.getByText("Start").click();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    act(() => {
      screen.getByText("Stop").click();
    });
    const countAfterStop = screen.getByTestId("count").textContent;
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("count").textContent).toBe(countAfterStop);
    expect(screen.getByTestId("running").textContent).toBe("stopped");
  });

  it("reset() restores the initial value and stops the countdown", () => {
    render(<TestComponent initialSeconds={10} />);
    act(() => {
      screen.getByText("Start").click();
    });
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    act(() => {
      screen.getByText("Reset").click();
    });
    expect(screen.getByTestId("count").textContent).toBe("10");
    expect(screen.getByTestId("running").textContent).toBe("stopped");
  });
});
