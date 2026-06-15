import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useColorScheme } from "./useColorScheme";

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
  const scheme = useColorScheme();
  return <div data-testid="result">{scheme}</div>;
}

describe("useColorScheme", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns "light" when matchMedia returns false for dark', () => {
    vi.stubGlobal("matchMedia", mockMatchMedia(false));
    render(<TestComponent />);
    expect(screen.getByTestId("result").textContent).toBe("light");
  });

  it('returns "dark" when matchMedia returns true', () => {
    vi.stubGlobal("matchMedia", mockMatchMedia(true));
    render(<TestComponent />);
    expect(screen.getByTestId("result").textContent).toBe("dark");
  });

  it("updates when media query change event fires", () => {
    let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
    const mql = {
      matches: false,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === "change") changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));

    render(<TestComponent />);
    expect(screen.getByTestId("result").textContent).toBe("light");

    act(() => {
      changeHandler!({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId("result").textContent).toBe("dark");
  });
});
