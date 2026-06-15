import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

class MockUtterance {
  text: string;
  voice: null = null;
  rate = 1;
  pitch = 1;
  volume = 1;
  lang = "";
  onstart: ((e: Event) => void) | null = null;
  onend: ((e: Event) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function SpeechSynthesisDisplay() {
  const { supported, speaking, voices, speak, cancel } = useSpeechSynthesis();
  return (
    <div>
      <span data-testid="supported">{String(supported)}</span>
      <span data-testid="speaking">{String(speaking)}</span>
      <span data-testid="voiceCount">{voices.length}</span>
      <button data-testid="speak" onClick={() => speak("hello")}>Speak</button>
      <button data-testid="cancel" onClick={cancel}>Cancel</button>
    </div>
  );
}

describe("useSpeechSynthesis", () => {
  beforeEach(() => {
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns supported true when speechSynthesis is in window", () => {
    vi.stubGlobal("speechSynthesis", {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<SpeechSynthesisDisplay />);
    expect(screen.getByTestId("supported").textContent).toBe("true");
  });

  it("calls speechSynthesis.speak when speak() is called", () => {
    const mockSpeak = vi.fn();
    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<SpeechSynthesisDisplay />);

    act(() => {
      screen.getByTestId("speak").click();
    });

    expect(mockSpeak).toHaveBeenCalled();
  });

  it("calls speechSynthesis.cancel when cancel() is called", () => {
    const mockCancel = vi.fn();
    vi.stubGlobal("speechSynthesis", {
      speak: vi.fn(),
      cancel: mockCancel,
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<SpeechSynthesisDisplay />);

    act(() => {
      screen.getByTestId("cancel").click();
    });

    expect(mockCancel).toHaveBeenCalled();
  });

  it("updates speaking via utterance events", () => {
    let capturedUtterance: MockUtterance | null = null;

    const mockSpeak = vi.fn((utterance: MockUtterance) => {
      capturedUtterance = utterance;
    });

    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<SpeechSynthesisDisplay />);
    expect(screen.getByTestId("speaking").textContent).toBe("false");

    act(() => {
      screen.getByTestId("speak").click();
    });

    act(() => {
      if (capturedUtterance && capturedUtterance.onstart) {
        capturedUtterance.onstart(new Event("start") as SpeechSynthesisEvent);
      }
    });

    expect(screen.getByTestId("speaking").textContent).toBe("true");

    act(() => {
      if (capturedUtterance && capturedUtterance.onend) {
        capturedUtterance.onend(new Event("end") as SpeechSynthesisEvent);
      }
    });

    expect(screen.getByTestId("speaking").textContent).toBe("false");
  });

  it("sets speaking false after cancel()", () => {
    const mockCancel = vi.fn();
    vi.stubGlobal("speechSynthesis", {
      speak: vi.fn(),
      cancel: mockCancel,
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<SpeechSynthesisDisplay />);

    act(() => {
      screen.getByTestId("cancel").click();
    });

    expect(screen.getByTestId("speaking").textContent).toBe("false");
  });
});
