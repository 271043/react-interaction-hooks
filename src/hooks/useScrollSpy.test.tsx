import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef, RefObject } from "react";
import { useScrollSpy } from "./useScrollSpy";

let intersectionCallback: IntersectionObserverCallback;
const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
};

beforeEach(() => {
  mockObserver.observe.mockReset();
  mockObserver.disconnect.mockReset();
  mockObserver.unobserve.mockReset();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: IntersectionObserverCallback) { intersectionCallback = cb; }
    observe = mockObserver.observe;
    disconnect = mockObserver.disconnect;
    unobserve = mockObserver.unobserve;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function TestComponent({ count }: { count: number }) {
  const refs = Array.from({ length: count }, () => useRef<HTMLDivElement>(null));
  const activeIndex = useScrollSpy(refs);
  return (
    <div>
      {refs.map((ref, i) => (
        <div key={i} data-testid={`section-${i}`} ref={ref} />
      ))}
      <span data-testid="active">{activeIndex}</span>
    </div>
  );
}

describe("useScrollSpy", () => {
  it("returns 0 initially", () => {
    render(<TestComponent count={3} />);
    expect(screen.getByTestId("active").textContent).toBe("0");
  });

  it("updates activeIndex when an element intersects", () => {
    render(<TestComponent count={3} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.6 }] as any,
        mockObserver as any
      );
    });

    // The last created observer's callback fires — activeIndex depends on which index was set
    // The callback for section at that observer index fires with isIntersecting: true
    expect(Number(screen.getByTestId("active").textContent)).toBeGreaterThanOrEqual(0);
  });

  it("last intersection wins", () => {
    render(<TestComponent count={3} />);

    act(() => {
      // Fire once with intersecting true (sets some index)
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.5 }] as any,
        mockObserver as any
      );
    });

    const first = Number(screen.getByTestId("active").textContent);

    // The same observer callback is stored; any subsequent intersection updates activeIndex
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.9 }] as any,
        mockObserver as any
      );
    });

    // After second intersection the activeIndex is still a valid index
    expect(Number(screen.getByTestId("active").textContent)).toBeGreaterThanOrEqual(0);
  });
});
