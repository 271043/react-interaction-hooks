import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { usePaste } from "./usePaste";

function TestComponent({ callback }: { callback: (text: string, event: ClipboardEvent) => void }) {
  usePaste(callback);
  return <div />;
}

function makeClipboardEvent(text: string): ClipboardEvent {
  const event = new Event("paste", { bubbles: true }) as ClipboardEvent;
  Object.defineProperty(event, "clipboardData", {
    value: { getData: (_: string) => text },
  });
  return event;
}

describe("usePaste", () => {
  it("callback is called with pasted text on paste event", () => {
    const callback = vi.fn();
    render(<TestComponent callback={callback} />);
    const event = makeClipboardEvent("pasted text");
    act(() => {
      document.dispatchEvent(event);
    });
    expect(callback).toHaveBeenCalledWith("pasted text", event);
  });

  it("callback receives the original ClipboardEvent", () => {
    const callback = vi.fn();
    render(<TestComponent callback={callback} />);
    const event = makeClipboardEvent("foo");
    act(() => {
      document.dispatchEvent(event);
    });
    expect(callback.mock.calls[0][1]).toBe(event);
  });

  it("cleanup removes the paste listener on unmount", () => {
    const callback = vi.fn();
    const { unmount } = render(<TestComponent callback={callback} />);
    unmount();
    const event = makeClipboardEvent("bar");
    act(() => {
      document.dispatchEvent(event);
    });
    expect(callback).not.toHaveBeenCalled();
  });
});
