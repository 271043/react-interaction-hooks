import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useReducedMotion } from "./useReducedMotion";

const mockMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

function TestComponent() {
  const reduced = useReducedMotion();
  return <div data-testid="status">{reduced ? "reduced" : "normal"}</div>;
}

describe("useReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when prefers-reduced-motion is not set", () => {
    vi.stubGlobal("matchMedia", mockMatchMedia(false));
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("normal");
  });

  it("returns true when prefers-reduced-motion: reduce is set", () => {
    vi.stubGlobal("matchMedia", mockMatchMedia(true));
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("reduced");
  });

  it("updates when the media query change event fires", () => {
    let changeHandler: ((e: Partial<MediaQueryListEvent>) => void) | null = null;

    const mql = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn((_, handler) => {
        changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));

    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("normal");

    act(() => {
      changeHandler!({ matches: true } as MediaQueryListEvent);
    });
    expect(screen.getByTestId("status").textContent).toBe("reduced");
  });
});
