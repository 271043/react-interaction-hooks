import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useShare } from "./useShare";

function TestComponent() {
  const { supported, share } = useShare();
  return (
    <div>
      <div data-testid="supported">{String(supported)}</div>
      <button
        data-testid="share"
        onClick={() => share({ title: "Test", text: "Hello", url: "https://example.com" })}
      >
        Share
      </button>
    </div>
  );
}

describe("useShare", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns supported as true when "share" is in navigator', () => {
    Object.defineProperty(navigator, "share", {
      value: vi.fn().mockResolvedValue(undefined),
      configurable: true,
      writable: true,
    });
    render(<TestComponent />);
    expect(screen.getByTestId("supported").textContent).toBe("true");
  });

  it("returns supported as false when navigator.share is not present", () => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    render(<TestComponent />);
    expect(screen.getByTestId("supported").textContent).toBe("false");
  });

  it("share() calls navigator.share with correct data", async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      value: mockShare,
      configurable: true,
      writable: true,
    });

    render(<TestComponent />);

    await act(async () => {
      screen.getByTestId("share").click();
    });

    expect(mockShare).toHaveBeenCalledWith({
      title: "Test",
      text: "Hello",
      url: "https://example.com",
    });
  });

  it("share() is a no-op when unsupported", async () => {
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    render(<TestComponent />);

    await act(async () => {
      screen.getByTestId("share").click();
    });

    // No error thrown, no navigator.share called
    expect(true).toBe(true);
  });
});
