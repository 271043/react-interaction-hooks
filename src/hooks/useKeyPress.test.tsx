import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useKeyPress } from "./useKeyPress";

function TestComponent({ targetKey }: { targetKey: string }) {
  const pressed = useKeyPress(targetKey);
  return <div data-testid="output">{pressed ? "pressed" : "released"}</div>;
}

describe("useKeyPress", () => {
  it("returns false initially", () => {
    render(<TestComponent targetKey="a" />);
    expect(screen.getByTestId("output").textContent).toBe("released");
  });

  it("returns true on keydown for the target key", () => {
    render(<TestComponent targetKey="a" />);
    act(() => {
      fireEvent.keyDown(document, { key: "a" });
    });
    expect(screen.getByTestId("output").textContent).toBe("pressed");
  });

  it("returns false on keyup after being pressed", () => {
    render(<TestComponent targetKey="a" />);
    act(() => {
      fireEvent.keyDown(document, { key: "a" });
    });
    act(() => {
      fireEvent.keyUp(document, { key: "a" });
    });
    expect(screen.getByTestId("output").textContent).toBe("released");
  });

  it("returns false when a different key is pressed", () => {
    render(<TestComponent targetKey="a" />);
    act(() => {
      fireEvent.keyDown(document, { key: "b" });
    });
    expect(screen.getByTestId("output").textContent).toBe("released");
  });

  it("stays true while the key is held", () => {
    render(<TestComponent targetKey="a" />);
    act(() => {
      fireEvent.keyDown(document, { key: "a" });
    });
    // Fire additional keydown events (browser repeat) — still true
    act(() => {
      fireEvent.keyDown(document, { key: "a" });
    });
    expect(screen.getByTestId("output").textContent).toBe("pressed");
  });
});
