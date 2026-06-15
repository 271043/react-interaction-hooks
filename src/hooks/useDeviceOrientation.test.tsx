import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useDeviceOrientation } from "./useDeviceOrientation";

function OrientationDisplay() {
  const { alpha, beta, gamma } = useDeviceOrientation();
  return (
    <div>
      <span data-testid="alpha">{alpha === null ? "null" : String(alpha)}</span>
      <span data-testid="beta">{beta === null ? "null" : String(beta)}</span>
      <span data-testid="gamma">{gamma === null ? "null" : String(gamma)}</span>
    </div>
  );
}

describe("useDeviceOrientation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns {alpha:null, beta:null, gamma:null} initially", () => {
    render(<OrientationDisplay />);
    expect(screen.getByTestId("alpha").textContent).toBe("null");
    expect(screen.getByTestId("beta").textContent).toBe("null");
    expect(screen.getByTestId("gamma").textContent).toBe("null");
  });

  it("updates when deviceorientation event fires on window", () => {
    render(<OrientationDisplay />);

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event("deviceorientation"), {
          alpha: 90,
          beta: 45,
          gamma: 10,
        })
      );
    });

    expect(screen.getByTestId("alpha").textContent).toBe("90");
    expect(screen.getByTestId("beta").textContent).toBe("45");
    expect(screen.getByTestId("gamma").textContent).toBe("10");
  });

  it("updates to new values on subsequent orientation events", () => {
    render(<OrientationDisplay />);

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event("deviceorientation"), {
          alpha: 180,
          beta: 0,
          gamma: -30,
        })
      );
    });

    expect(screen.getByTestId("alpha").textContent).toBe("180");
    expect(screen.getByTestId("beta").textContent).toBe("0");
    expect(screen.getByTestId("gamma").textContent).toBe("-30");
  });
});
