import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useIdle } from "./useIdle";

function TestComponent({ timeout }: { timeout: number }) {
  const isIdle = useIdle(timeout);
  return <span data-testid="idle">{isIdle ? "idle" : "active"}</span>;
}

describe("useIdle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is false (active) initially", () => {
    render(<TestComponent timeout={3000} />);
    expect(screen.getByTestId("idle").textContent).toBe("active");
  });

  it("becomes true after timeout with no activity", () => {
    render(<TestComponent timeout={3000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("idle").textContent).toBe("idle");
  });

  it("resets to false on mousemove", () => {
    render(<TestComponent timeout={3000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("idle").textContent).toBe("idle");
    act(() => {
      fireEvent.mouseMove(document);
    });
    expect(screen.getByTestId("idle").textContent).toBe("active");
  });

  it("resets to false on keydown", () => {
    render(<TestComponent timeout={3000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("idle").textContent).toBe("idle");
    act(() => {
      fireEvent.keyDown(document);
    });
    expect(screen.getByTestId("idle").textContent).toBe("active");
  });

  it("resets to false on touchstart", () => {
    render(<TestComponent timeout={3000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("idle").textContent).toBe("idle");
    act(() => {
      fireEvent.touchStart(document);
    });
    expect(screen.getByTestId("idle").textContent).toBe("active");
  });
});
