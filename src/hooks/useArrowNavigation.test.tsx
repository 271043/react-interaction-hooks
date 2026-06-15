import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useArrowNavigation } from "./useArrowNavigation";

function TestComponent({
  orientation = "vertical",
  loop = true,
}: {
  orientation?: "vertical" | "horizontal" | "both";
  loop?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  useArrowNavigation(ref, { selector: "button", orientation, loop });
  return (
    <ul ref={ref} data-testid="container">
      <li><button data-testid="item-0">Item 0</button></li>
      <li><button data-testid="item-1">Item 1</button></li>
      <li><button data-testid="item-2">Item 2</button></li>
    </ul>
  );
}

describe("useArrowNavigation", () => {
  it("ArrowDown moves focus to the next item", () => {
    render(<TestComponent />);
    const first = screen.getByTestId("item-0");
    act(() => { first.focus(); });
    act(() => {
      fireEvent.keyDown(screen.getByTestId("container"), { key: "ArrowDown" });
    });
    expect(document.activeElement).toBe(screen.getByTestId("item-1"));
  });

  it("ArrowUp moves focus to the previous item", () => {
    render(<TestComponent />);
    const second = screen.getByTestId("item-1");
    act(() => { second.focus(); });
    act(() => {
      fireEvent.keyDown(screen.getByTestId("container"), { key: "ArrowUp" });
    });
    expect(document.activeElement).toBe(screen.getByTestId("item-0"));
  });

  it("loops from last to first when loop=true", () => {
    render(<TestComponent loop={true} />);
    const last = screen.getByTestId("item-2");
    act(() => { last.focus(); });
    act(() => {
      fireEvent.keyDown(screen.getByTestId("container"), { key: "ArrowDown" });
    });
    expect(document.activeElement).toBe(screen.getByTestId("item-0"));
  });

  it("does not loop past last when loop=false", () => {
    render(<TestComponent loop={false} />);
    const last = screen.getByTestId("item-2");
    act(() => { last.focus(); });
    act(() => {
      fireEvent.keyDown(screen.getByTestId("container"), { key: "ArrowDown" });
    });
    expect(document.activeElement).toBe(last);
  });

  it("ArrowRight and ArrowLeft work in horizontal orientation", () => {
    render(<TestComponent orientation="horizontal" loop={true} />);
    const first = screen.getByTestId("item-0");
    act(() => { first.focus(); });
    act(() => {
      fireEvent.keyDown(screen.getByTestId("container"), { key: "ArrowRight" });
    });
    expect(document.activeElement).toBe(screen.getByTestId("item-1"));

    act(() => {
      fireEvent.keyDown(screen.getByTestId("container"), { key: "ArrowLeft" });
    });
    expect(document.activeElement).toBe(screen.getByTestId("item-0"));
  });
});
