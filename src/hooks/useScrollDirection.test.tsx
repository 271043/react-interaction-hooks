import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useScrollDirection } from "./useScrollDirection";

function TestComponent() {
  const direction = useScrollDirection();
  return <span data-testid="direction">{direction ?? "null"}</span>;
}

describe("useScrollDirection", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 0 });
  });

  it("returns null initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("direction").textContent).toBe("null");
  });

  it('returns "down" when scrollY increases', () => {
    render(<TestComponent />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 100 });
      fireEvent.scroll(window);
    });

    expect(screen.getByTestId("direction").textContent).toBe("down");
  });

  it('returns "up" when scrollY decreases', () => {
    render(<TestComponent />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 200 });
      fireEvent.scroll(window);
    });

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 50 });
      fireEvent.scroll(window);
    });

    expect(screen.getByTestId("direction").textContent).toBe("up");
  });

  it("does not change direction if scrollY is unchanged", () => {
    render(<TestComponent />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 100 });
      fireEvent.scroll(window);
    });

    act(() => {
      // scrollY stays at 100 — no change
      fireEvent.scroll(window);
    });

    expect(screen.getByTestId("direction").textContent).toBe("down");
  });
});
