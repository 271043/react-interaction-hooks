import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useState } from "react";
import { useCopyToClipboard } from "./useCopyToClipboard";

function TestComponent({ resetDelay }: { resetDelay?: number }) {
  const { copied, copy } = useCopyToClipboard(resetDelay);
  return (
    <div>
      <span data-testid="status">{copied ? "copied" : "idle"}</span>
      <button onClick={() => copy("hello")}>Copy</button>
    </div>
  );
}

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("copied is false initially", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("status").textContent).toBe("idle");
  });

  it("copy() writes text to the clipboard", async () => {
    render(<TestComponent />);
    await act(async () => {
      fireEvent.click(screen.getByText("Copy"));
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
  });

  it("copied is true after copy()", async () => {
    render(<TestComponent />);
    await act(async () => {
      fireEvent.click(screen.getByText("Copy"));
    });
    expect(screen.getByTestId("status").textContent).toBe("copied");
  });

  it("resets copied to false after resetDelay", async () => {
    render(<TestComponent resetDelay={1000} />);
    await act(async () => {
      fireEvent.click(screen.getByText("Copy"));
    });
    expect(screen.getByTestId("status").textContent).toBe("copied");
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("status").textContent).toBe("idle");
  });
});
