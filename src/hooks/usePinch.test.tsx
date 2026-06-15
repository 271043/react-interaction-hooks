import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { usePinch } from "./usePinch";

interface PinchState {
  scale: number;
  origin: { x: number; y: number };
}

function PinchTest({
  onPinch,
  onPinchEnd,
}: {
  onPinch: (state: PinchState) => void;
  onPinchEnd?: (state: PinchState) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  usePinch(ref, { onPinch, onPinchEnd });
  return <div ref={ref} data-testid="target" />;
}

function makeTouchList(touches: Array<{ clientX: number; clientY: number }>) {
  return touches.map((t, i) => ({
    identifier: i,
    target: document.body,
    clientX: t.clientX,
    clientY: t.clientY,
    pageX: t.clientX,
    pageY: t.clientY,
    screenX: t.clientX,
    screenY: t.clientY,
  }));
}

describe("usePinch", () => {
  it("onPinch is called with scale on touchmove with 2 touches", () => {
    const onPinch = vi.fn();
    render(<PinchTest onPinch={onPinch} />);
    const el = screen.getByTestId("target");

    // Start: two fingers 100px apart (horizontally)
    fireEvent.touchStart(el, {
      touches: makeTouchList([
        { clientX: 0, clientY: 0 },
        { clientX: 100, clientY: 0 },
      ]),
    });

    // Move: fingers 200px apart — scale should be ~2
    fireEvent.touchMove(el, {
      touches: makeTouchList([
        { clientX: 0, clientY: 0 },
        { clientX: 200, clientY: 0 },
      ]),
    });

    expect(onPinch).toHaveBeenCalledTimes(1);
    expect(onPinch.mock.calls[0][0].scale).toBeCloseTo(2, 1);
  });

  it("onPinchEnd is called on touchend after a pinch gesture", () => {
    const onPinch = vi.fn();
    const onPinchEnd = vi.fn();
    render(<PinchTest onPinch={onPinch} onPinchEnd={onPinchEnd} />);
    const el = screen.getByTestId("target");

    fireEvent.touchStart(el, {
      touches: makeTouchList([
        { clientX: 0, clientY: 0 },
        { clientX: 100, clientY: 0 },
      ]),
    });
    fireEvent.touchMove(el, {
      touches: makeTouchList([
        { clientX: 0, clientY: 0 },
        { clientX: 150, clientY: 0 },
      ]),
    });
    fireEvent.touchEnd(el, { touches: [] });

    expect(onPinchEnd).toHaveBeenCalledTimes(1);
  });

  it("scale > 1 when fingers spread apart", () => {
    const onPinch = vi.fn();
    render(<PinchTest onPinch={onPinch} />);
    const el = screen.getByTestId("target");

    fireEvent.touchStart(el, {
      touches: makeTouchList([
        { clientX: 50, clientY: 0 },
        { clientX: 150, clientY: 0 },
      ]),
    });
    // Spread: distance doubles
    fireEvent.touchMove(el, {
      touches: makeTouchList([
        { clientX: 0, clientY: 0 },
        { clientX: 200, clientY: 0 },
      ]),
    });

    const { scale } = onPinch.mock.calls[0][0];
    expect(scale).toBeGreaterThan(1);
  });

  it("scale < 1 when fingers pinch together", () => {
    const onPinch = vi.fn();
    render(<PinchTest onPinch={onPinch} />);
    const el = screen.getByTestId("target");

    // Start: fingers 200px apart
    fireEvent.touchStart(el, {
      touches: makeTouchList([
        { clientX: 0, clientY: 0 },
        { clientX: 200, clientY: 0 },
      ]),
    });
    // Pinch: fingers 100px apart
    fireEvent.touchMove(el, {
      touches: makeTouchList([
        { clientX: 50, clientY: 0 },
        { clientX: 150, clientY: 0 },
      ]),
    });

    const { scale } = onPinch.mock.calls[0][0];
    expect(scale).toBeLessThan(1);
  });

  it("single touch does not trigger onPinch", () => {
    const onPinch = vi.fn();
    render(<PinchTest onPinch={onPinch} />);
    const el = screen.getByTestId("target");

    // touchstart with only 1 finger
    fireEvent.touchStart(el, {
      touches: makeTouchList([{ clientX: 100, clientY: 100 }]),
    });
    // touchmove with only 1 finger
    fireEvent.touchMove(el, {
      touches: makeTouchList([{ clientX: 150, clientY: 100 }]),
    });

    expect(onPinch).not.toHaveBeenCalled();
  });
});
