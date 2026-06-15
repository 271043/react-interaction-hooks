import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useDrag } from "./useDrag";

function DragTest() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useDrag(ref);
  return (
    <div ref={ref} data-testid="draggable">
      <span data-testid="isDragging">{String(state.isDragging)}</span>
      <span data-testid="deltaX">{state.delta.x}</span>
      <span data-testid="deltaY">{state.delta.y}</span>
      <span data-testid="posX">{state.position.x}</span>
      <span data-testid="posY">{state.position.y}</span>
    </div>
  );
}

describe("useDrag", () => {
  it("isDragging is false initially", () => {
    render(<DragTest />);
    expect(screen.getByTestId("isDragging").textContent).toBe("false");
  });

  it("isDragging becomes true on mousedown", () => {
    render(<DragTest />);
    const el = screen.getByTestId("draggable");
    fireEvent.mouseDown(el, { clientX: 10, clientY: 20 });
    expect(screen.getByTestId("isDragging").textContent).toBe("true");
  });

  it("delta updates on mousemove after mousedown", () => {
    render(<DragTest />);
    const el = screen.getByTestId("draggable");
    fireEvent.mouseDown(el, { clientX: 10, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 30, clientY: 50 });
    expect(screen.getByTestId("deltaX").textContent).toBe("20");
    expect(screen.getByTestId("deltaY").textContent).toBe("30");
  });

  it("position tracks current mouse coordinates on mousemove", () => {
    render(<DragTest />);
    const el = screen.getByTestId("draggable");
    fireEvent.mouseDown(el, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 55, clientY: 77 });
    expect(screen.getByTestId("posX").textContent).toBe("55");
    expect(screen.getByTestId("posY").textContent).toBe("77");
  });

  it("isDragging becomes false after mouseup", () => {
    render(<DragTest />);
    const el = screen.getByTestId("draggable");
    fireEvent.mouseDown(el, { clientX: 10, clientY: 10 });
    expect(screen.getByTestId("isDragging").textContent).toBe("true");
    fireEvent.mouseUp(document);
    expect(screen.getByTestId("isDragging").textContent).toBe("false");
  });

  it("delta resets correctly — mousemove without prior mousedown does not update state", () => {
    render(<DragTest />);
    // no mousedown, so startPos is null and handleMove returns early
    fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
    expect(screen.getByTestId("deltaX").textContent).toBe("0");
    expect(screen.getByTestId("deltaY").textContent).toBe("0");
  });
});
