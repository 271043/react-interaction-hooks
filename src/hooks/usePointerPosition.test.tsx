import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { usePointerPosition } from "./usePointerPosition";

function TestComponent() {
  const position = usePointerPosition();
  return (
    <div data-testid="output">
      {JSON.stringify(position)}
    </div>
  );
}

describe("usePointerPosition", () => {
  it("initial position is {x:0, y:0, clientX:0, clientY:0}", () => {
    render(<TestComponent />);
    expect(JSON.parse(screen.getByTestId("output").textContent!)).toEqual({
      x: 0,
      y: 0,
      clientX: 0,
      clientY: 0,
    });
  });

  it("updates position on mousemove", () => {
    render(<TestComponent />);
    const event = new MouseEvent("mousemove", { bubbles: true, clientX: 80, clientY: 160 });
    Object.defineProperty(event, "pageX", { value: 100, configurable: true });
    Object.defineProperty(event, "pageY", { value: 200, configurable: true });
    act(() => { document.dispatchEvent(event); });
    expect(JSON.parse(screen.getByTestId("output").textContent!)).toEqual({
      x: 100,
      y: 200,
      clientX: 80,
      clientY: 160,
    });
  });

  it("tracks multiple successive mouse moves", () => {
    render(<TestComponent />);

    const event1 = new MouseEvent("mousemove", { bubbles: true, clientX: 5, clientY: 15 });
    Object.defineProperty(event1, "pageX", { value: 10, configurable: true });
    Object.defineProperty(event1, "pageY", { value: 20, configurable: true });
    act(() => { document.dispatchEvent(event1); });

    const event2 = new MouseEvent("mousemove", { bubbles: true, clientX: 290, clientY: 390 });
    Object.defineProperty(event2, "pageX", { value: 300, configurable: true });
    Object.defineProperty(event2, "pageY", { value: 400, configurable: true });
    act(() => { document.dispatchEvent(event2); });

    expect(JSON.parse(screen.getByTestId("output").textContent!)).toEqual({
      x: 300,
      y: 400,
      clientX: 290,
      clientY: 390,
    });
  });
});
