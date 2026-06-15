import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useGamepad } from "./useGamepad";

function GamepadDisplay() {
  const { gamepads, connected } = useGamepad();
  return (
    <div>
      <span data-testid="count">{gamepads.length}</span>
      <span data-testid="connected">{String(connected)}</span>
    </div>
  );
}

describe("useGamepad", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("starts with empty gamepads and connected false", () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      getGamepads: vi.fn().mockReturnValue([]),
    });

    render(<GamepadDisplay />);
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("connected").textContent).toBe("false");
  });

  it("populates gamepads when gamepadconnected fires", () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      getGamepads: vi.fn().mockReturnValue([{ id: "Gamepad 1" }]),
    });

    render(<GamepadDisplay />);

    act(() => {
      window.dispatchEvent(new Event("gamepadconnected"));
    });

    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("connected").textContent).toBe("true");
  });

  it("sets connected true when gamepads.length > 0", () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      getGamepads: vi.fn().mockReturnValue([{ id: "Gamepad 1" }, { id: "Gamepad 2" }]),
    });

    render(<GamepadDisplay />);

    act(() => {
      window.dispatchEvent(new Event("gamepadconnected"));
    });

    expect(screen.getByTestId("connected").textContent).toBe("true");
  });

  it("empties gamepads on gamepaddisconnected", () => {
    const mockGetGamepads = vi.fn().mockReturnValue([{ id: "Gamepad 1" }]);
    vi.stubGlobal("navigator", {
      ...navigator,
      getGamepads: mockGetGamepads,
    });

    render(<GamepadDisplay />);

    act(() => {
      window.dispatchEvent(new Event("gamepadconnected"));
    });

    expect(screen.getByTestId("count").textContent).toBe("1");

    mockGetGamepads.mockReturnValue([]);

    act(() => {
      window.dispatchEvent(new Event("gamepaddisconnected"));
    });

    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("connected").textContent).toBe("false");
  });
});
