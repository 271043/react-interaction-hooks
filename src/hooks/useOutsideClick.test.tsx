import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { useOutsideClick } from "./useOutsideClick";

function TestComponent({
  handler,
  enabled,
}: {
  handler: () => void;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, handler, enabled);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        inside
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

describe("useOutsideClick", () => {
  let handler: () => void;

  beforeEach(() => {
    handler = vi.fn() as unknown as () => void;
  });

  it("calls handler when clicking outside the ref element", () => {
    render(<TestComponent handler={handler} />);
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when clicking inside the ref element", () => {
    render(<TestComponent handler={handler} />);
    fireEvent.mouseDown(screen.getByTestId("inside"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("calls handler on touchstart outside", () => {
    render(<TestComponent handler={handler} />);
    fireEvent.touchStart(screen.getByTestId("outside"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when disabled", () => {
    render(<TestComponent handler={handler} enabled={false} />);
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler when clicking the ref element itself", () => {
    render(<TestComponent handler={handler} />);
    fireEvent.mouseDown(screen.getByTestId("inside"));
    expect(handler).not.toHaveBeenCalled();
  });
});
