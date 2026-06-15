import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useLongPress } from "./useLongPress";

function TestComponent({
  callback,
  threshold,
  onStart,
  onCancel,
}: {
  callback: () => void;
  threshold?: number;
  onStart?: () => void;
  onCancel?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useLongPress(ref, callback, { threshold, onStart, onCancel });
  return <button ref={ref} data-testid="target">hold me</button>;
}

describe("useLongPress", () => {
  let callback: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    callback = vi.fn() as unknown as () => void;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls callback after default threshold (500ms)", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    expect(callback).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(500); });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls callback after custom threshold", () => {
    render(<TestComponent callback={callback} threshold={800} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(799); });
    expect(callback).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(1); });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback if released before threshold", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(400); });
    fireEvent.mouseUp(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call callback if mouse leaves before threshold", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(300); });
    fireEvent.mouseLeave(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(300); });
    expect(callback).not.toHaveBeenCalled();
  });

  it("calls callback on touchstart after threshold", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.touchStart(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(500); });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels on touchend before threshold", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.touchStart(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(300); });
    fireEvent.touchEnd(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(300); });
    expect(callback).not.toHaveBeenCalled();
  });

  it("calls onStart when press begins", () => {
    const onStart = vi.fn();
    render(<TestComponent callback={callback} onStart={onStart} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when released before threshold", () => {
    const onCancel = vi.fn();
    render(<TestComponent callback={callback} onCancel={onCancel} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    fireEvent.mouseUp(screen.getByTestId("target"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not call onCancel after successful long press", () => {
    const onCancel = vi.fn();
    render(<TestComponent callback={callback} onCancel={onCancel} />);
    fireEvent.mouseDown(screen.getByTestId("target"));
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.mouseUp(screen.getByTestId("target"));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
