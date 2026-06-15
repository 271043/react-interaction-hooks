import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useMouseLeaveWindow } from "./useMouseLeaveWindow";

function TestComponent({ callback }: { callback: () => void }) {
  useMouseLeaveWindow(callback);
  return <div data-testid="root">root</div>;
}

describe("useMouseLeaveWindow", () => {
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    callback = vi.fn();
  });

  it("calls callback on mouseleave with relatedTarget null (pointer exits viewport)", () => {
    render(<TestComponent callback={callback} />);
    const event = new MouseEvent("mouseleave", {
      bubbles: false,
      cancelable: true,
      relatedTarget: null,
    });
    document.dispatchEvent(event);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does NOT call callback when mouse leaves to another element (relatedTarget not null)", () => {
    render(<TestComponent callback={callback} />);
    const target = document.createElement("div");
    document.body.appendChild(target);
    const event = new MouseEvent("mouseleave", {
      bubbles: false,
      cancelable: true,
      relatedTarget: target,
    });
    document.dispatchEvent(event);
    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(target);
  });
});
