import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useRef } from "react";
import { useElementPosition } from "./useElementPosition";

type Position = { x: number; y: number; top: number; left: number; right: number; bottom: number; width: number; height: number };

function TestComponent({ onPos }: { onPos: (p: Position) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useElementPosition(ref);
  onPos(pos);
  return <div ref={ref} />;
}

describe("useElementPosition", () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns all zeros initially", () => {
    const positions: Position[] = [];
    render(<TestComponent onPos={(p) => positions.push(p)} />);
    expect(positions[0]).toEqual({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 });
  });

  it("updates after a window resize event", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 10, y: 20, top: 20, left: 10, right: 210, bottom: 120, width: 200, height: 100,
      toJSON: () => {},
    }));

    const positions: Position[] = [];
    render(<TestComponent onPos={(p) => positions.push(p)} />);

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const last = positions[positions.length - 1];
    expect(last).toEqual({ x: 10, y: 20, top: 20, left: 10, right: 210, bottom: 120, width: 200, height: 100 });
  });

  it("updates after a window scroll event", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      x: 5, y: 50, top: 50, left: 5, right: 105, bottom: 150, width: 100, height: 100,
      toJSON: () => {},
    }));

    const positions: Position[] = [];
    render(<TestComponent onPos={(p) => positions.push(p)} />);

    act(() => {
      window.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    const last = positions[positions.length - 1];
    expect(last).toEqual({ x: 5, y: 50, top: 50, left: 5, right: 105, bottom: 150, width: 100, height: 100 });
  });
});
