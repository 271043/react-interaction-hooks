import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useSwipe } from "./useSwipe";

function SwipeTest({ onSwipe, threshold }: { onSwipe: (dir: string) => void; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useSwipe(ref, { onSwipe, threshold });
  return <div ref={ref} data-testid="swipeable" />;
}

function fireSwipe(el: HTMLElement, dx: number, dy: number) {
  fireEvent.touchStart(el, {
    touches: [{ clientX: 100, clientY: 100 }],
  });
  fireEvent.touchEnd(el, {
    changedTouches: [{ clientX: 100 + dx, clientY: 100 + dy }],
  });
}

describe("useSwipe", () => {
  it("calls onSwipe('left') on left swipe", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} />);
    fireSwipe(screen.getByTestId("swipeable"), -60, 0);
    expect(onSwipe).toHaveBeenCalledWith("left");
  });

  it("calls onSwipe('right') on right swipe", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} />);
    fireSwipe(screen.getByTestId("swipeable"), 60, 0);
    expect(onSwipe).toHaveBeenCalledWith("right");
  });

  it("calls onSwipe('up') on upward swipe", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} />);
    fireSwipe(screen.getByTestId("swipeable"), 0, -60);
    expect(onSwipe).toHaveBeenCalledWith("up");
  });

  it("calls onSwipe('down') on downward swipe", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} />);
    fireSwipe(screen.getByTestId("swipeable"), 0, 60);
    expect(onSwipe).toHaveBeenCalledWith("down");
  });

  it("does NOT fire onSwipe if distance < threshold", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} threshold={50} />);
    fireSwipe(screen.getByTestId("swipeable"), 30, 0);
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it("diagonal swipe picks dominant axis (horizontal wins when |dx| > |dy|)", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} />);
    // dx=80, dy=40 — horizontal dominates
    fireSwipe(screen.getByTestId("swipeable"), 80, 40);
    expect(onSwipe).toHaveBeenCalledWith("right");
  });

  it("diagonal swipe picks dominant axis (vertical wins when |dy| > |dx|)", () => {
    const onSwipe = vi.fn();
    render(<SwipeTest onSwipe={onSwipe} />);
    // dx=30, dy=-70 — vertical dominates
    fireSwipe(screen.getByTestId("swipeable"), 30, -70);
    expect(onSwipe).toHaveBeenCalledWith("up");
  });
});
