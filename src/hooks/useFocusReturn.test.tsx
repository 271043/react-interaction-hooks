import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useFocusReturn } from "./useFocusReturn";

function Modal({ onClose }: { onClose: () => void }) {
  useFocusReturn();
  return (
    <div data-testid="modal">
      <button data-testid="modal-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

function TestComponent() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button data-testid="trigger" onClick={() => setOpen(true)}>
        Open
      </button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </div>
  );
}

import React from "react";

describe("useFocusReturn", () => {
  it("restores focus to the previously focused element on unmount", () => {
    render(<TestComponent />);
    const trigger = screen.getByTestId("trigger");

    act(() => {
      trigger.focus();
    });
    expect(document.activeElement).toBe(trigger);

    act(() => {
      fireEvent.click(trigger);
    });
    // modal is now open; close it
    act(() => {
      fireEvent.click(screen.getByTestId("modal-btn"));
    });

    expect(document.activeElement).toBe(trigger);
  });

  it("does nothing special when no element was focused on mount", () => {
    // Just ensure no error is thrown when activeElement is body
    const SimpleModal = () => {
      useFocusReturn();
      return <div data-testid="simple-modal" />;
    };

    const { unmount } = render(<SimpleModal />);
    expect(() => unmount()).not.toThrow();
  });
});
