import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useKeySequence } from "./useKeySequence";

function TestComponent({
  sequence,
  callback,
}: {
  sequence: string[];
  callback: () => void;
}) {
  useKeySequence(sequence, callback);
  return <div data-testid="output" />;
}

describe("useKeySequence", () => {
  it("fires callback after the correct full sequence", () => {
    const cb = vi.fn();
    render(<TestComponent sequence={["a", "b", "c"]} callback={cb} />);
    act(() => {
      fireEvent.keyDown(window, { key: "a" });
      fireEvent.keyDown(window, { key: "b" });
      fireEvent.keyDown(window, { key: "c" });
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does not fire on a partial sequence", () => {
    const cb = vi.fn();
    render(<TestComponent sequence={["a", "b", "c"]} callback={cb} />);
    act(() => {
      fireEvent.keyDown(window, { key: "a" });
      fireEvent.keyDown(window, { key: "b" });
    });
    expect(cb).not.toHaveBeenCalled();
  });

  it("does not fire after a wrong key mid-sequence", () => {
    const cb = vi.fn();
    render(<TestComponent sequence={["a", "b", "c"]} callback={cb} />);
    act(() => {
      fireEvent.keyDown(window, { key: "a" });
      fireEvent.keyDown(window, { key: "x" }); // wrong key
      fireEvent.keyDown(window, { key: "c" });
    });
    expect(cb).not.toHaveBeenCalled();
  });

  it("resets and fires again on a repeat of the full sequence", () => {
    const cb = vi.fn();
    render(<TestComponent sequence={["a", "b"]} callback={cb} />);
    act(() => {
      fireEvent.keyDown(window, { key: "a" });
      fireEvent.keyDown(window, { key: "b" });
    });
    act(() => {
      fireEvent.keyDown(window, { key: "a" });
      fireEvent.keyDown(window, { key: "b" });
    });
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("fires on a single-key sequence", () => {
    const cb = vi.fn();
    render(<TestComponent sequence={["Enter"]} callback={cb} />);
    act(() => {
      fireEvent.keyDown(window, { key: "Enter" });
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
