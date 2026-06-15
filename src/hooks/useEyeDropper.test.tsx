import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useEyeDropper } from "./useEyeDropper";

function EyeDropperDisplay() {
  const { supported, color, open } = useEyeDropper();
  return (
    <div>
      <span data-testid="supported">{String(supported)}</span>
      <span data-testid="color">{color ?? "null"}</span>
      <button data-testid="open" onClick={async () => { await open(); }}>Open</button>
    </div>
  );
}

describe("useEyeDropper", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns supported false when EyeDropper not in window", () => {
    // Ensure EyeDropper is not defined
    const original = (window as unknown as Record<string, unknown>).EyeDropper;
    delete (window as unknown as Record<string, unknown>).EyeDropper;

    render(<EyeDropperDisplay />);
    expect(screen.getByTestId("supported").textContent).toBe("false");

    if (original !== undefined) {
      (window as unknown as Record<string, unknown>).EyeDropper = original;
    }
  });

  it("open() returns null when EyeDropper is unsupported", async () => {
    const original = (window as unknown as Record<string, unknown>).EyeDropper;
    delete (window as unknown as Record<string, unknown>).EyeDropper;

    let result: string | null = undefined as unknown as string | null;
    function CaptureDisplay() {
      const { open } = useEyeDropper();
      return (
        <button
          data-testid="open"
          onClick={async () => {
            result = await open();
          }}
        >
          Open
        </button>
      );
    }

    render(<CaptureDisplay />);

    await act(async () => {
      screen.getByTestId("open").click();
      await Promise.resolve();
    });

    expect(result).toBeNull();

    if (original !== undefined) {
      (window as unknown as Record<string, unknown>).EyeDropper = original;
    }
  });

  it("open() returns sRGBHex on success", async () => {
    const mockOpen = vi.fn().mockResolvedValue({ sRGBHex: "#ff0000" });
    vi.stubGlobal("EyeDropper", class { open = mockOpen; });

    let result: string | null = null;
    function CaptureDisplay() {
      const { open } = useEyeDropper();
      return (
        <button
          data-testid="open"
          onClick={async () => {
            result = await open();
          }}
        >
          Open
        </button>
      );
    }

    render(<CaptureDisplay />);

    await act(async () => {
      screen.getByTestId("open").click();
      await Promise.resolve();
    });

    expect(result).toBe("#ff0000");
  });

  it("updates color state after successful pick", async () => {
    const mockOpen = vi.fn().mockResolvedValue({ sRGBHex: "#ff0000" });
    vi.stubGlobal("EyeDropper", class { open = mockOpen; });

    render(<EyeDropperDisplay />);
    expect(screen.getByTestId("color").textContent).toBe("null");

    await act(async () => {
      screen.getByTestId("open").click();
      await Promise.resolve();
    });

    expect(screen.getByTestId("color").textContent).toBe("#ff0000");
  });

  it("returns null on error or cancel", async () => {
    const mockOpen = vi.fn().mockRejectedValue(new Error("AbortError"));
    vi.stubGlobal("EyeDropper", class { open = mockOpen; });

    let result: string | null = undefined as unknown as string | null;
    function CaptureDisplay() {
      const { open } = useEyeDropper();
      return (
        <button
          data-testid="open"
          onClick={async () => {
            result = await open();
          }}
        >
          Open
        </button>
      );
    }

    render(<CaptureDisplay />);

    await act(async () => {
      screen.getByTestId("open").click();
      await Promise.resolve();
    });

    expect(result).toBeNull();
  });
});
