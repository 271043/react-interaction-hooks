import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";

function TestComponent({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, enabled);
  return (
    <div ref={ref} data-testid="container">
      <button data-testid="btn-first">First</button>
      <button data-testid="btn-second">Second</button>
      <button data-testid="btn-last">Last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("auto-focuses the first focusable item on mount when enabled", () => {
    render(<TestComponent enabled={true} />);
    expect(document.activeElement).toBe(screen.getByTestId("btn-first"));
  });

  it("wraps Tab from the last focusable element to the first", () => {
    render(<TestComponent enabled={true} />);
    const last = screen.getByTestId("btn-last");
    act(() => {
      last.focus();
    });
    act(() => {
      fireEvent.keyDown(last, { key: "Tab", shiftKey: false });
    });
    expect(document.activeElement).toBe(screen.getByTestId("btn-first"));
  });

  it("wraps Shift+Tab from the first focusable element to the last", () => {
    render(<TestComponent enabled={true} />);
    const first = screen.getByTestId("btn-first");
    act(() => {
      first.focus();
    });
    act(() => {
      fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
    });
    expect(document.activeElement).toBe(screen.getByTestId("btn-last"));
  });

  it("does nothing when disabled", () => {
    render(<TestComponent enabled={false} />);
    // auto-focus should not happen
    expect(document.activeElement).not.toBe(screen.getByTestId("btn-first"));
  });

  it("does not intercept non-Tab keys", () => {
    render(<TestComponent enabled={true} />);
    const first = screen.getByTestId("btn-first");
    act(() => {
      first.focus();
    });
    // Press Enter — focus should remain on first (no wrap)
    act(() => {
      fireEvent.keyDown(first, { key: "Enter" });
    });
    expect(document.activeElement).toBe(first);
  });
});
