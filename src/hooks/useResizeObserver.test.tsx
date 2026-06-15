import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useRef } from "react";
import { useResizeObserver } from "./useResizeObserver";

let resizeCallback: ResizeObserverCallback;
const mockObserver = { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };

function TestComponent({ onSize }: { onSize: (s: { width: number; height: number }) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useResizeObserver(ref);
  onSize(size);
  return <div ref={ref} />;
}

describe("useResizeObserver", () => {
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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns {width:0, height:0} initially", () => {
    const sizes: { width: number; height: number }[] = [];
    render(<TestComponent onSize={(s) => sizes.push(s)} />);
    expect(sizes[0]).toEqual({ width: 0, height: 0 });
  });

  it("updates size when ResizeObserver fires", () => {
    const sizes: { width: number; height: number }[] = [];
    render(<TestComponent onSize={(s) => sizes.push(s)} />);

    act(() => {
      resizeCallback(
        [{ contentRect: { width: 200, height: 100 } }] as any,
        mockObserver as any
      );
    });

    const last = sizes[sizes.length - 1];
    expect(last).toEqual({ width: 200, height: 100 });
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<TestComponent onSize={() => {}} />);
    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);
  });
});
