import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useTabFocus } from "./useTabFocus";

function TestComponent() {
  const isTabFocused = useTabFocus();
  return <div data-testid="status">{isTabFocused ? "tab" : "mouse"}</div>;
}

describe("useTabFocus", () => {
  it("returns false initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("mouse");
  });

  it("returns true after a Tab keydown", () => {
    render(<TestComponent />);
    act(() => {
      fireEvent.keyDown(window, { key: "Tab" });
    });
    expect(screen.getByTestId("status").textContent).toBe("tab");
  });

  it("returns false after a mousedown", () => {
    render(<TestComponent />);
    act(() => {
      fireEvent.keyDown(window, { key: "Tab" });
    });
    act(() => {
      fireEvent.mouseDown(window);
    });
    expect(screen.getByTestId("status").textContent).toBe("mouse");
  });

  it("alternates correctly between Tab and mousedown", () => {
    render(<TestComponent />);
    const status = screen.getByTestId("status");

    act(() => { fireEvent.keyDown(window, { key: "Tab" }); });
    expect(status.textContent).toBe("tab");

    act(() => { fireEvent.mouseDown(window); });
    expect(status.textContent).toBe("mouse");

    act(() => { fireEvent.keyDown(window, { key: "Tab" }); });
    expect(status.textContent).toBe("tab");
  });
});
