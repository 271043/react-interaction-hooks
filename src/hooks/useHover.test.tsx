import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useHover } from "./useHover";

function TestComponent({ enterDelay, leaveDelay }: { enterDelay?: number; leaveDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useHover(ref, { enterDelay, leaveDelay });
  return (
    <div ref={ref} data-testid="target">
      {isHovered ? "hovered" : "idle"}
    </div>
  );
}

describe("useHover", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("target").textContent).toBe("idle");
  });

  it("returns true on mouseenter", () => {
    render(<TestComponent />);
    fireEvent.mouseEnter(screen.getByTestId("target"));
    expect(screen.getByTestId("target").textContent).toBe("hovered");
  });

  it("returns false on mouseleave", () => {
    render(<TestComponent />);
    const el = screen.getByTestId("target");
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
    expect(el.textContent).toBe("idle");
  });

  it("respects enterDelay before setting hovered", () => {
    render(<TestComponent enterDelay={300} />);
    const el = screen.getByTestId("target");
    fireEvent.mouseEnter(el);
    expect(el.textContent).toBe("idle");

    act(() => { vi.advanceTimersByTime(300); });
    expect(el.textContent).toBe("hovered");
  });

  it("respects leaveDelay before clearing hovered", () => {
    render(<TestComponent leaveDelay={200} />);
    const el = screen.getByTestId("target");
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
    expect(el.textContent).toBe("hovered");

    act(() => { vi.advanceTimersByTime(200); });
    expect(el.textContent).toBe("idle");
  });

  it("cancels pending enterDelay if mouse leaves before delay completes", () => {
    render(<TestComponent enterDelay={300} />);
    const el = screen.getByTestId("target");
    fireEvent.mouseEnter(el);
    act(() => { vi.advanceTimersByTime(100); });
    fireEvent.mouseLeave(el);
    act(() => { vi.advanceTimersByTime(300); });
    expect(el.textContent).toBe("idle");
  });
});
