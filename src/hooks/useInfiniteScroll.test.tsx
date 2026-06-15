import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";

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

function TestComponent({ onLoadMore }: { onLoadMore: () => Promise<void> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { loading } = useInfiniteScroll(ref, onLoadMore);
  return (
    <div>
      <div data-testid="sentinel" ref={ref} />
      <span data-testid="loading">{String(loading)}</span>
    </div>
  );
}

describe("useInfiniteScroll", () => {
  it("loading is false initially", () => {
    const onLoadMore = vi.fn().mockResolvedValue(undefined);
    render(<TestComponent onLoadMore={onLoadMore} />);
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("calls onLoadMore when sentinel intersects", async () => {
    const onLoadMore = vi.fn().mockResolvedValue(undefined);
    render(<TestComponent onLoadMore={onLoadMore} />);

    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.5 }] as any,
        mockObserver as any
      );
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("sets loading true during callback and false after it resolves", async () => {
    let resolve!: () => void;
    const onLoadMore = vi.fn(
      () =>
        new Promise<void>((res) => {
          resolve = res;
        })
    );

    render(<TestComponent onLoadMore={onLoadMore} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.5 }] as any,
        mockObserver as any
      );
    });

    // loading becomes true after the intersection triggers the async call
    expect(screen.getByTestId("loading").textContent).toBe("true");

    await act(async () => {
      resolve();
    });

    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("does not call onLoadMore again while loading is true", async () => {
    let resolve!: () => void;
    const onLoadMore = vi.fn(
      () =>
        new Promise<void>((res) => {
          resolve = res;
        })
    );

    render(<TestComponent onLoadMore={onLoadMore} />);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.5 }] as any,
        mockObserver as any
      );
    });

    // While still loading, trigger intersection again
    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, intersectionRatio: 0.5 }] as any,
        mockObserver as any
      );
    });

    // onLoadMore should only have been called once
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolve();
    });
  });
});
