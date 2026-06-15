import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { useContextMenu } from "./useContextMenu";

function TestComponent({ callback }: { callback: (event: MouseEvent) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useContextMenu(ref, callback);
  return <div ref={ref} data-testid="target">target</div>;
}

describe("useContextMenu", () => {
  let callback: (event: MouseEvent) => void;

  beforeEach(() => {
    callback = vi.fn() as unknown as (event: MouseEvent) => void;
  });

  it("calls callback on right-click (contextmenu event)", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.contextMenu(screen.getByTestId("target"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("prevents the default context menu (calls preventDefault)", () => {
    render(<TestComponent callback={callback} />);
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    screen.getByTestId("target").dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("does not call callback on a regular left click", () => {
    render(<TestComponent callback={callback} />);
    fireEvent.click(screen.getByTestId("target"));
    expect(callback).not.toHaveBeenCalled();
  });
});
