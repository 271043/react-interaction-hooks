import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useNotification } from "./useNotification";

function TestComponent() {
  const { permission, supported, requestPermission, notify } = useNotification();
  return (
    <div>
      <div data-testid="supported">{String(supported)}</div>
      <div data-testid="permission">{permission}</div>
      <button data-testid="request" onClick={requestPermission}>Request</button>
      <button data-testid="notify" onClick={() => notify("Test title")}>Notify</button>
    </div>
  );
}

describe("useNotification", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns supported as true when Notification is in window", () => {
    vi.stubGlobal(
      "Notification",
      Object.assign(vi.fn(), {
        permission: "granted" as NotificationPermission,
        requestPermission: vi.fn().mockResolvedValue("granted"),
      })
    );

    render(<TestComponent />);
    expect(screen.getByTestId("supported").textContent).toBe("true");
  });

  it("returns supported as false when Notification is not in window", () => {
    vi.stubGlobal("Notification", undefined);

    render(<TestComponent />);
    expect(screen.getByTestId("supported").textContent).toBe("false");
  });

  it("permission reflects Notification.permission", () => {
    vi.stubGlobal(
      "Notification",
      Object.assign(vi.fn(), {
        permission: "denied" as NotificationPermission,
        requestPermission: vi.fn().mockResolvedValue("denied"),
      })
    );

    render(<TestComponent />);
    expect(screen.getByTestId("permission").textContent).toBe("denied");
  });

  it("requestPermission() calls Notification.requestPermission", async () => {
    const mockRequestPermission = vi.fn().mockResolvedValue("granted");
    vi.stubGlobal(
      "Notification",
      Object.assign(vi.fn(), {
        permission: "default" as NotificationPermission,
        requestPermission: mockRequestPermission,
      })
    );

    render(<TestComponent />);

    await act(async () => {
      screen.getByTestId("request").click();
    });

    expect(mockRequestPermission).toHaveBeenCalledOnce();
  });

  it("notify() creates new Notification when permission is granted", async () => {
    const MockNotification = Object.assign(vi.fn(), {
      permission: "granted" as NotificationPermission,
      requestPermission: vi.fn().mockResolvedValue("granted"),
    });
    vi.stubGlobal("Notification", MockNotification);

    render(<TestComponent />);

    act(() => {
      screen.getByTestId("notify").click();
    });

    expect(MockNotification).toHaveBeenCalledWith("Test title", undefined);
  });

  it("notify() returns null when permission is not granted", async () => {
    vi.stubGlobal(
      "Notification",
      Object.assign(vi.fn(), {
        permission: "denied" as NotificationPermission,
        requestPermission: vi.fn().mockResolvedValue("denied"),
      })
    );

    render(<TestComponent />);

    // Clicking notify when denied should not construct a Notification
    act(() => {
      screen.getByTestId("notify").click();
    });

    // The mock constructor should not have been called (only called for new Notification())
    // Since Notification is used as a constructor and for static props, check call count
    // The vi.fn() used as constructor is not called when permission is denied
    const NotificationMock = window.Notification as unknown as ReturnType<typeof vi.fn>;
    expect(NotificationMock).not.toHaveBeenCalled();
  });
});
