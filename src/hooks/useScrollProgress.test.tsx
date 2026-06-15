import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";

function WindowProgressComponent() {
  const progress = useScrollProgress();
  return <span data-testid="progress">{progress}</span>;
}

function ElementProgressComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);
  return (
    <div>
      <div data-testid="el" ref={ref} />
      <span data-testid="progress">{progress}</span>
    </div>
  );
}

describe("useScrollProgress", () => {
  describe("window mode", () => {
    beforeEach(() => {
      Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 0 });
      Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 800 });
      Object.defineProperty(document.documentElement, "scrollHeight", {
        writable: true,
        configurable: true,
        value: 1600,
      });
    });

    it("returns 0 initially", () => {
      render(<WindowProgressComponent />);
      expect(Number(screen.getByTestId("progress").textContent)).toBe(0);
    });

    it("updates when scroll event fires", () => {
      render(<WindowProgressComponent />);

      act(() => {
        Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 400 });
        fireEvent.scroll(window);
      });

      // max = 1600 - 800 = 800, progress = 400 / 800 = 0.5
      expect(Number(screen.getByTestId("progress").textContent)).toBeCloseTo(0.5);
    });
  });

  describe("element mode", () => {
    it("uses scrollTop and scrollHeight of the element", () => {
      render(<ElementProgressComponent />);

      const el = screen.getByTestId("el");

      act(() => {
        Object.defineProperty(el, "scrollHeight", { writable: true, configurable: true, value: 500 });
        Object.defineProperty(el, "clientHeight", { writable: true, configurable: true, value: 250 });
        Object.defineProperty(el, "scrollTop", { writable: true, configurable: true, value: 125 });
        fireEvent.scroll(el);
      });

      // max = 500 - 250 = 250, progress = 125 / 250 = 0.5
      expect(Number(screen.getByTestId("progress").textContent)).toBeCloseTo(0.5);
    });
  });
});
