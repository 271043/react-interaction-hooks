import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useScrollIntoView } from "./useScrollIntoView";

function TestComponent({
  options,
  mockScrollIntoView,
}: {
  options?: ScrollIntoViewOptions;
  mockScrollIntoView: (arg?: boolean | ScrollIntoViewOptions) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollIntoView = options ? useScrollIntoView(ref, options) : useScrollIntoView(ref);

  return (
    <div>
      <div
        data-testid="target"
        ref={(node) => {
          if (node) {
            node.scrollIntoView = mockScrollIntoView;
            (ref as React.MutableRefObject<HTMLDivElement>).current = node;
          }
        }}
      />
      <button data-testid="trigger" onClick={scrollIntoView}>
        Scroll
      </button>
    </div>
  );
}

function NullRefComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollIntoView = useScrollIntoView(ref);
  return (
    <button data-testid="trigger" onClick={scrollIntoView}>
      Scroll
    </button>
  );
}

describe("useScrollIntoView", () => {
  it("calls scrollIntoView on ref.current when the returned function is invoked", () => {
    const mockScrollIntoView = vi.fn() as unknown as (arg?: boolean | ScrollIntoViewOptions) => void;
    render(<TestComponent mockScrollIntoView={mockScrollIntoView} />);

    fireEvent.click(screen.getByTestId("trigger"));

    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("passes options to scrollIntoView", () => {
    const mockScrollIntoView = vi.fn() as unknown as (arg?: boolean | ScrollIntoViewOptions) => void;
    const options: ScrollIntoViewOptions = { behavior: "instant", block: "start" };
    render(<TestComponent options={options} mockScrollIntoView={mockScrollIntoView} />);

    fireEvent.click(screen.getByTestId("trigger"));

    expect(mockScrollIntoView).toHaveBeenCalledWith(options);
  });

  it("does nothing when ref.current is null", () => {
    // NullRefComponent has no target div mounted, so ref.current stays null
    render(<NullRefComponent />);

    // Should not throw
    expect(() => fireEvent.click(screen.getByTestId("trigger"))).not.toThrow();
  });
});
