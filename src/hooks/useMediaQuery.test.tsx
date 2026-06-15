import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

const mockMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

function TestComponent({ query }: { query: string }) {
  const matches = useMediaQuery(query);
  return <div data-testid="result">{String(matches)}</div>;
}

describe("useMediaQuery", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when matchMedia returns false", () => {
    vi.stubGlobal("matchMedia", mockMatchMedia(false));
    render(<TestComponent query="(max-width: 768px)" />);
    expect(screen.getByTestId("result").textContent).toBe("false");
  });

  it("returns true when matchMedia returns true", () => {
    vi.stubGlobal("matchMedia", mockMatchMedia(true));
    render(<TestComponent query="(max-width: 768px)" />);
    expect(screen.getByTestId("result").textContent).toBe("true");
  });

  it("updates when media query change event fires", () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const mql = {
      matches: false,
      media: "(max-width: 768px)",
      onchange: null,
      addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === "change") changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));

    render(<TestComponent query="(max-width: 768px)" />);
    expect(screen.getByTestId("result").textContent).toBe("false");

    act(() => {
      changeHandler!({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId("result").textContent).toBe("true");
  });
});
