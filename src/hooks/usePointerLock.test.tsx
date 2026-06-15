import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useRef } from "react";
import { usePointerLock } from "./usePointerLock";

function TestComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const { isLocked, lock, unlock } = usePointerLock(ref);
  return (
    <div>
      <div ref={ref} data-testid="target">target</div>
      <div data-testid="status">{isLocked ? "locked" : "unlocked"}</div>
      <button data-testid="lock-btn" onClick={() => lock()}>Lock</button>
      <button data-testid="unlock-btn" onClick={() => unlock()}>Unlock</button>
    </div>
  );
}

describe("usePointerLock", () => {
  let requestPointerLockMock: ReturnType<typeof vi.fn>;
  let exitPointerLockMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    requestPointerLockMock = vi.fn().mockResolvedValue(undefined);
    exitPointerLockMock = vi.fn();

    Object.defineProperty(HTMLDivElement.prototype, "requestPointerLock", {
      value: requestPointerLockMock,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document, "exitPointerLock", {
      value: exitPointerLockMock,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document, "pointerLockElement", {
      value: null,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("isLocked is initially false", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("unlocked");
  });

  it("lock() calls requestPointerLock on the element", async () => {
    render(<TestComponent />);
    await act(async () => {
      screen.getByTestId("lock-btn").click();
    });
    expect(requestPointerLockMock).toHaveBeenCalledTimes(1);
  });

  it("unlock() calls exitPointerLock when a pointer lock element exists", async () => {
    render(<TestComponent />);
    const target = screen.getByTestId("target");
    Object.defineProperty(document, "pointerLockElement", {
      value: target,
      writable: true,
      configurable: true,
    });
    await act(async () => {
      screen.getByTestId("unlock-btn").click();
    });
    expect(exitPointerLockMock).toHaveBeenCalledTimes(1);
  });

  it("pointerlockchange event updates isLocked state", async () => {
    render(<TestComponent />);
    const target = screen.getByTestId("target");

    Object.defineProperty(document, "pointerLockElement", {
      value: target,
      writable: true,
      configurable: true,
    });

    await act(async () => {
      document.dispatchEvent(new Event("pointerlockchange"));
    });

    expect(screen.getByTestId("status").textContent).toBe("locked");

    Object.defineProperty(document, "pointerLockElement", {
      value: null,
      writable: true,
      configurable: true,
    });

    await act(async () => {
      document.dispatchEvent(new Event("pointerlockchange"));
    });

    expect(screen.getByTestId("status").textContent).toBe("unlocked");
  });
});
