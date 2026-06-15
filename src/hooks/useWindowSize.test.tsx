import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useWindowSize } from "./useWindowSize";

function TestComponent({ onSize }: { onSize: (s: { width: number; height: number }) => void }) {
  const size = useWindowSize();
  onSize(size);
  return null;
}

describe("useWindowSize", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 768 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial size matching window.innerWidth/innerHeight", () => {
    const sizes: { width: number; height: number }[] = [];
    render(<TestComponent onSize={(s) => sizes.push(s)} />);
    expect(sizes[0]).toEqual({ width: 1024, height: 768 });
  });

  it("updates when a resize event fires on window", () => {
    const sizes: { width: number; height: number }[] = [];
    render(<TestComponent onSize={(s) => sizes.push(s)} />);

    act(() => {
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });
      Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 600 });
      window.dispatchEvent(new Event("resize"));
    });

    const last = sizes[sizes.length - 1];
    expect(last).toEqual({ width: 800, height: 600 });
  });
});
