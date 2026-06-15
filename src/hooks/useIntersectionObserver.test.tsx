import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useRef } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

let intersectionCallback: IntersectionObserverCallback;
const mockIO = { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };

function TestComponent({
  onState,
}: {
  onState: (s: { isIntersecting: boolean; ratio: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useIntersectionObserver(ref);
  onState(state);
  return <div ref={ref} />;
}

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class {
      constructor(cb: IntersectionObserverCallback) { intersectionCallback = cb; }
      observe = mockIO.observe;
      disconnect = mockIO.disconnect;
      unobserve = mockIO.unobserve;
    });
    mockIO.observe.mockClear();
    mockIO.disconnect.mockClear();
    mockIO.unobserve.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns {isIntersecting: false, ratio: 0} initially", () => {
    const states: { isIntersecting: boolean; ratio: number }[] = [];
    render(<TestComponent onState={(s) => states.push(s)} />);
    expect(states[0]).toEqual({ isIntersecting: false, ratio: 0 });
  });

  it("sets isIntersecting true when observer fires with isIntersecting=true", () => {
    const states: { isIntersecting: boolean; ratio: number }[] = [];
    render(<TestComponent onState={(s) => states.push(s)} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.75 }] as any,
        mockIO as any
      );
    });

    const last = states[states.length - 1];
    expect(last.isIntersecting).toBe(true);
    expect(last.ratio).toBe(0.75);
  });

  it("updates ratio when observer fires with a new ratio", () => {
    const states: { isIntersecting: boolean; ratio: number }[] = [];
    render(<TestComponent onState={(s) => states.push(s)} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: false, intersectionRatio: 0.3 }] as any,
        mockIO as any
      );
    });

    const last = states[states.length - 1];
    expect(last.ratio).toBe(0.3);
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<TestComponent onState={() => {}} />);
    unmount();
    expect(mockIO.disconnect).toHaveBeenCalledTimes(1);
  });
});
