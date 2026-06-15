import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useRef } from "react";
import { useContainerQuery } from "./useContainerQuery";

let resizeCallback: ResizeObserverCallback;
const mockObserver = { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };

const BREAKPOINTS = { small: 300, large: 800 };

function TestComponent({ onMatches }: { onMatches: (m: Record<string, boolean>) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const matches = useContainerQuery(ref, BREAKPOINTS);
  onMatches(matches);
  return <div ref={ref} />;
}

describe("useContainerQuery", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
      constructor(cb: ResizeObserverCallback) { resizeCallback = cb; }
      observe = mockObserver.observe;
      disconnect = mockObserver.disconnect;
      unobserve = mockObserver.unobserve;
    });
    mockObserver.observe.mockClear();
    mockObserver.disconnect.mockClear();
    mockObserver.unobserve.mockClear();

    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 0, height: 0, x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns all false initially when element has zero width", () => {
    const results: Record<string, boolean>[] = [];
    render(<TestComponent onMatches={(m) => results.push(m)} />);
    expect(results[0]).toEqual({ small: false, large: false });
  });

  it("marks small breakpoint true when element width meets its value", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 400, height: 0, x: 0, y: 0, top: 0, left: 0, right: 400, bottom: 0,
      toJSON: () => {},
    }));

    const results: Record<string, boolean>[] = [];
    render(<TestComponent onMatches={(m) => results.push(m)} />);

    act(() => {
      resizeCallback([] as any, mockObserver as any);
    });

    const last = results[results.length - 1];
    expect(last.small).toBe(true);
    expect(last.large).toBe(false);
  });

  it("keeps large breakpoint false when width does not meet it", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 500, height: 0, x: 0, y: 0, top: 0, left: 0, right: 500, bottom: 0,
      toJSON: () => {},
    }));

    const results: Record<string, boolean>[] = [];
    render(<TestComponent onMatches={(m) => results.push(m)} />);

    act(() => {
      resizeCallback([] as any, mockObserver as any);
    });

    const last = results[results.length - 1];
    expect(last.small).toBe(true);
    expect(last.large).toBe(false);
  });
});
