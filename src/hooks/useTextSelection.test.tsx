import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useTextSelection } from "./useTextSelection";

function TestComponent() {
  const { text, rect } = useTextSelection();
  return (
    <div>
      <span data-testid="text">{text}</span>
      <span data-testid="rect">{rect ? "has-rect" : "no-rect"}</span>
    </div>
  );
}

describe("useTextSelection", () => {
  beforeEach(() => {
    // Reset window.getSelection to collapsed by default
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: true,
      rangeCount: 0,
      toString: () => "",
      getRangeAt: vi.fn(),
    } as unknown as Selection);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with empty text and null rect", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("text").textContent).toBe("");
    expect(screen.getByTestId("rect").textContent).toBe("no-rect");
  });

  it("updates on selectionchange with selected text", () => {
    render(<TestComponent />);

    const mockRect = { top: 10, left: 20, width: 100, height: 20 } as DOMRect;
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => "selected text",
      getRangeAt: () => ({ getBoundingClientRect: () => mockRect }),
    } as unknown as Selection);

    act(() => {
      document.dispatchEvent(new Event("selectionchange"));
    });

    expect(screen.getByTestId("text").textContent).toBe("selected text");
    expect(screen.getByTestId("rect").textContent).toBe("has-rect");
  });

  it("clears when selection becomes collapsed", () => {
    render(<TestComponent />);

    // First set an active selection
    const mockRect = {} as DOMRect;
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => "some text",
      getRangeAt: () => ({ getBoundingClientRect: () => mockRect }),
    } as unknown as Selection);

    act(() => {
      document.dispatchEvent(new Event("selectionchange"));
    });

    expect(screen.getByTestId("text").textContent).toBe("some text");

    // Now collapse the selection
    vi.spyOn(window, "getSelection").mockReturnValue({
      isCollapsed: true,
      rangeCount: 0,
      toString: () => "",
      getRangeAt: vi.fn(),
    } as unknown as Selection);

    act(() => {
      document.dispatchEvent(new Event("selectionchange"));
    });

    expect(screen.getByTestId("text").textContent).toBe("");
    expect(screen.getByTestId("rect").textContent).toBe("no-rect");
  });
});
