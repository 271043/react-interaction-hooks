import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useScrollPosition } from "./useScrollPosition";

function TestComponent() {
  const position = useScrollPosition();
  return (
    <div>
      <span data-testid="x">{position.x}</span>
      <span data-testid="y">{position.y}</span>
    </div>
  );
}

describe("useScrollPosition", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollX", { writable: true, configurable: true, value: 0 });
    Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 0 });
  });

  it("returns {x:0, y:0} initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("x").textContent).toBe("0");
    expect(screen.getByTestId("y").textContent).toBe("0");
  });

  it("updates y when window scroll event fires with a new scrollY", () => {
    render(<TestComponent />);

    act(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 200 });
      fireEvent.scroll(window);
    });

    expect(screen.getByTestId("y").textContent).toBe("200");
  });

  it("tracks x and y independently", () => {
    render(<TestComponent />);

    act(() => {
      Object.defineProperty(window, "scrollX", { writable: true, configurable: true, value: 100 });
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 300 });
      fireEvent.scroll(window);
    });

    expect(screen.getByTestId("x").textContent).toBe("100");
    expect(screen.getByTestId("y").textContent).toBe("300");
  });
});
