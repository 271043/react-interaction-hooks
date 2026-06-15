import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { usePermission } from "./usePermission";

function TestComponent({ name }: { name: PermissionName }) {
  const state = usePermission(name);
  return <div data-testid="result">{state === null ? "null" : state}</div>;
}

describe("usePermission", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when navigator.permissions is unavailable", () => {
    const originalPermissions = navigator.permissions;
    Object.defineProperty(navigator, "permissions", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    render(<TestComponent name={"camera" as PermissionName} />);
    expect(screen.getByTestId("result").textContent).toBe("null");

    Object.defineProperty(navigator, "permissions", {
      value: originalPermissions,
      configurable: true,
      writable: true,
    });
  });

  it('returns "granted" when permission query resolves with granted', async () => {
    const mockStatus = {
      state: "granted" as PermissionState,
      onchange: null as (() => void) | null,
    };
    Object.defineProperty(navigator, "permissions", {
      value: { query: vi.fn().mockResolvedValue(mockStatus) },
      configurable: true,
      writable: true,
    });

    await act(async () => {
      render(<TestComponent name={"camera" as PermissionName} />);
    });

    expect(screen.getByTestId("result").textContent).toBe("granted");
  });

  it('returns "denied" when permission query resolves with denied', async () => {
    const mockStatus = {
      state: "denied" as PermissionState,
      onchange: null as (() => void) | null,
    };
    Object.defineProperty(navigator, "permissions", {
      value: { query: vi.fn().mockResolvedValue(mockStatus) },
      configurable: true,
      writable: true,
    });

    await act(async () => {
      render(<TestComponent name={"camera" as PermissionName} />);
    });

    expect(screen.getByTestId("result").textContent).toBe("denied");
  });

  it('returns "prompt" when permission query resolves with prompt', async () => {
    const mockStatus = {
      state: "prompt" as PermissionState,
      onchange: null as (() => void) | null,
    };
    Object.defineProperty(navigator, "permissions", {
      value: { query: vi.fn().mockResolvedValue(mockStatus) },
      configurable: true,
      writable: true,
    });

    await act(async () => {
      render(<TestComponent name={"notifications" as PermissionName} />);
    });

    expect(screen.getByTestId("result").textContent).toBe("prompt");
  });

  it("updates when onchange fires", async () => {
    const mockStatus = {
      state: "prompt" as PermissionState,
      onchange: null as (() => void) | null,
    };
    Object.defineProperty(navigator, "permissions", {
      value: { query: vi.fn().mockResolvedValue(mockStatus) },
      configurable: true,
      writable: true,
    });

    await act(async () => {
      render(<TestComponent name={"camera" as PermissionName} />);
    });

    expect(screen.getByTestId("result").textContent).toBe("prompt");

    await act(async () => {
      mockStatus.state = "granted";
      mockStatus.onchange?.();
    });

    expect(screen.getByTestId("result").textContent).toBe("granted");
  });
});
