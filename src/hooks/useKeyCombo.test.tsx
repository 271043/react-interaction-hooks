import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useKeyCombo } from "./useKeyCombo";

function TestComponent({
  combo,
  callback,
  enabled,
}: {
  combo: string;
  callback: (e: KeyboardEvent) => void;
  enabled?: boolean;
}) {
  useKeyCombo(combo, callback, { enabled });
  return null;
}

describe("useKeyCombo", () => {
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callback = vi.fn();
  });

  it("calls callback when matching key is pressed", () => {
    render(<TestComponent combo="k" callback={callback} />);
    fireEvent.keyDown(document, { key: "k" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("is case-insensitive for the key", () => {
    render(<TestComponent combo="k" callback={callback} />);
    fireEvent.keyDown(document, { key: "K" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls callback for Ctrl+K", () => {
    render(<TestComponent combo="ctrl+k" callback={callback} />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback if modifier is missing", () => {
    render(<TestComponent combo="ctrl+k" callback={callback} />);
    fireEvent.keyDown(document, { key: "k" });
    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call callback if extra modifier is pressed", () => {
    render(<TestComponent combo="ctrl+k" callback={callback} />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true, shiftKey: true });
    expect(callback).not.toHaveBeenCalled();
  });

  it("calls callback for Ctrl+Shift+K", () => {
    render(<TestComponent combo="ctrl+shift+k" callback={callback} />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true, shiftKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls callback for Escape", () => {
    render(<TestComponent combo="escape" callback={callback} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback when disabled", () => {
    render(<TestComponent combo="k" callback={callback} enabled={false} />);
    fireEvent.keyDown(document, { key: "k" });
    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call callback for wrong key", () => {
    render(<TestComponent combo="k" callback={callback} />);
    fireEvent.keyDown(document, { key: "j" });
    expect(callback).not.toHaveBeenCalled();
  });
});
