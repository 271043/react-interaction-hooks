import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useFocusWithin } from "./useFocusWithin";

function TestComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const focusWithin = useFocusWithin(ref);
  return (
    <div>
      <div ref={ref} data-testid="container">
        <button data-testid="child-a">A</button>
        <button data-testid="child-b">B</button>
      </div>
      <button data-testid="outside">Outside</button>
      <div data-testid="status">{focusWithin ? "within" : "outside"}</div>
    </div>
  );
}

describe("useFocusWithin", () => {
  it("returns false initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("outside");
  });

  it("returns true when a child receives focus (focusin)", () => {
    render(<TestComponent />);
    const childA = screen.getByTestId("child-a");
    act(() => {
      fireEvent.focusIn(childA);
    });
    expect(screen.getByTestId("status").textContent).toBe("within");
  });

  it("returns false when focus leaves the container (focusout to outside)", () => {
    render(<TestComponent />);
    const container = screen.getByTestId("container");
    const outside = screen.getByTestId("outside");

    act(() => {
      fireEvent.focusIn(container);
    });
    act(() => {
      // relatedTarget points outside the container
      fireEvent.focusOut(container, { relatedTarget: outside });
    });
    expect(screen.getByTestId("status").textContent).toBe("outside");
  });

  it("stays true when focus moves between children", () => {
    render(<TestComponent />);
    const container = screen.getByTestId("container");
    const childA = screen.getByTestId("child-a");
    const childB = screen.getByTestId("child-b");

    act(() => {
      fireEvent.focusIn(childA);
    });
    act(() => {
      // focusout with relatedTarget still inside container
      fireEvent.focusOut(container, { relatedTarget: childB });
    });
    expect(screen.getByTestId("status").textContent).toBe("within");
  });
});
