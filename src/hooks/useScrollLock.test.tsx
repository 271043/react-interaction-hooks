import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useScrollLock } from "./useScrollLock";

function TestComponent({ locked }: { locked: boolean }) {
  useScrollLock(locked);
  return null;
}

describe("useScrollLock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  });

  it("sets fixed styles on body when locked", () => {
    render(<TestComponent locked={true} />);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.width).toBe("100%");
  });

  it("does not modify body styles when unlocked", () => {
    render(<TestComponent locked={false} />);
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
  });

  it("saves scroll position as negative top for iOS Safari", () => {
    Object.defineProperty(window, "scrollY", {
      value: 200,
      writable: true,
      configurable: true,
    });
    render(<TestComponent locked={true} />);
    expect(document.body.style.top).toBe("-200px");
  });

  it("restores original body styles on unlock", () => {
    document.body.style.overflow = "auto";
    const { rerender } = render(<TestComponent locked={true} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<TestComponent locked={false} />);
    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.position).toBe("");
  });

  it("restores scroll position on unlock", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(window, "scrollY", {
      value: 350,
      writable: true,
      configurable: true,
    });

    const { rerender } = render(<TestComponent locked={true} />);
    rerender(<TestComponent locked={false} />);

    expect(scrollTo).toHaveBeenCalledWith(0, 350);
    scrollTo.mockRestore();
  });
});
