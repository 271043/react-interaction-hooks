import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useState } from "react";
import { useDebounce } from "./useDebounce";

function TestComponent({ delay }: { delay: number }) {
  const [value, setValue] = useState("initial");
  const debounced = useDebounce(value, delay);
  return (
    <div>
      <span data-testid="debounced">{debounced}</span>
      <button onClick={() => setValue("updated")}>Update</button>
      <button onClick={() => setValue("final")}>Final</button>
    </div>
  );
}

function NumberComponent({ delay }: { delay: number }) {
  const [value, setValue] = useState(0);
  const debounced = useDebounce(value, delay);
  return (
    <div>
      <span data-testid="debounced">{debounced}</span>
      <button onClick={() => setValue((v) => v + 1)}>Increment</button>
    </div>
  );
}

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    render(<TestComponent delay={300} />);
    expect(screen.getByTestId("debounced").textContent).toBe("initial");
  });

  it("delays the update when the value changes", () => {
    render(<TestComponent delay={300} />);
    act(() => {
      screen.getByText("Update").click();
    });
    expect(screen.getByTestId("debounced").textContent).toBe("initial");
  });

  it("returns the final value after delay elapses", () => {
    render(<TestComponent delay={300} />);
    act(() => {
      screen.getByText("Update").click();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByTestId("debounced").textContent).toBe("updated");
  });

  it("resets timer on each rapid change and uses the last value", () => {
    render(<TestComponent delay={300} />);
    act(() => {
      screen.getByText("Update").click();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      screen.getByText("Final").click();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Still within 300ms of last change
    expect(screen.getByTestId("debounced").textContent).toBe("initial");
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByTestId("debounced").textContent).toBe("final");
  });

  it("works with number type", () => {
    render(<NumberComponent delay={200} />);
    expect(screen.getByTestId("debounced").textContent).toBe("0");
    act(() => {
      screen.getByText("Increment").click();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByTestId("debounced").textContent).toBe("1");
  });
});
