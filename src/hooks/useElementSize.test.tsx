import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useRef } from "react";
import { useElementSize } from "./useElementSize";

let resizeCallback: ResizeObserverCallback;
const mockObserver = { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };

function TestComponent({ onSize }: { onSize: (s: { width: number; height: number }) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);
  onSize(size);
  return <div ref={ref} />;
}

describe("useElementSize", () => {
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

    // getBoundingClientRect returns zeros by default in jsdom
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns {width:0, height:0} initially", () => {
    const sizes: { width: number; height: number }[] = [];
    render(<TestComponent onSize={(s) => sizes.push(s)} />);
    expect(sizes[0]).toEqual({ width: 0, height: 0 });
  });

  it("updates size after ResizeObserver fires", () => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 300,
      height: 150,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 300,
      bottom: 150,
      toJSON: () => {},
    }));

    const sizes: { width: number; height: number }[] = [];
    render(<TestComponent onSize={(s) => sizes.push(s)} />);

    act(() => {
      resizeCallback([] as any, mockObserver as any);
    });

    const last = sizes[sizes.length - 1];
    expect(last).toEqual({ width: 300, height: 150 });
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<TestComponent onSize={() => {}} />);
    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);
  });
});
