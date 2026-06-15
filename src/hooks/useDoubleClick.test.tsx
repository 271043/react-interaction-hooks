import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useDoubleClick } from "./useDoubleClick";

function TestComponent({
  callback,
  threshold,
}: {
  callback: (event: MouseEvent) => void;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDoubleClick(ref, callback, threshold !== undefined ? { threshold } : {});
  return <div ref={ref} data-testid="target">target</div>;
}

describe("useDoubleClick", () => {
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callback = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires callback on two clicks within the default threshold", () => {
    render(<TestComponent callback={callback} />);
    const el = screen.getByTestId("target");
    fireEvent.click(el);
    act(() => { vi.advanceTimersByTime(100); });
    fireEvent.click(el);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire on a single click", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.click(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(400); });
    expect(callback).not.toHaveBeenCalled();
  });

  it("does not fire when clicks exceed the threshold gap", () => {
    render(<TestComponent callback={callback} />);
    const el = screen.getByTestId("target");
    fireEvent.click(el);
    act(() => { vi.advanceTimersByTime(350); });
    fireEvent.click(el);
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires on a custom threshold", () => {
    render(<TestComponent callback={callback} threshold={500} />);
    const el = screen.getByTestId("target");
    fireEvent.click(el);
    act(() => { vi.advanceTimersByTime(400); });
    fireEvent.click(el);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not fire when clicks exceed a custom threshold gap", () => {
    render(<TestComponent callback={callback} threshold={500} />);
    const el = screen.getByTestId("target");
    fireEvent.click(el);
    act(() => { vi.advanceTimersByTime(600); });
    fireEvent.click(el);
    expect(callback).not.toHaveBeenCalled();
  });
});
