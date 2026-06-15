import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useSpeechRecognition } from "./useSpeechRecognition";

function SpeechRecognitionDisplay() {
  const { supported, listening, transcript, start, stop, reset } = useSpeechRecognition();
  return (
    <div>
      <span data-testid="supported">{String(supported)}</span>
      <span data-testid="listening">{String(listening)}</span>
      <span data-testid="transcript">{transcript}</span>
      <button data-testid="start" onClick={start}>Start</button>
      <button data-testid="stop" onClick={stop}>Stop</button>
      <button data-testid="reset" onClick={reset}>Reset</button>
    </div>
  );
}

describe("useSpeechRecognition", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns supported false when SpeechRecognition not in window", () => {
    vi.stubGlobal("SpeechRecognition", undefined);
    vi.stubGlobal("webkitSpeechRecognition", undefined);

    render(<SpeechRecognitionDisplay />);
    expect(screen.getByTestId("supported").textContent).toBe("false");
  });

  it("returns supported true when SpeechRecognition is in window", () => {
    const mockInstance = {
      continuous: false,
      interimResults: false,
      lang: "",
      onresult: null as ((e: unknown) => void) | null,
      onend: null as (() => void) | null,
      start: vi.fn(),
      stop: vi.fn(),
    };
    class MockSR {
      continuous = mockInstance.continuous;
      interimResults = mockInstance.interimResults;
      lang = mockInstance.lang;
      get onresult() { return mockInstance.onresult; }
      set onresult(v) { mockInstance.onresult = v; }
      get onend() { return mockInstance.onend; }
      set onend(v) { mockInstance.onend = v; }
      start = mockInstance.start;
      stop = mockInstance.stop;
    }
    vi.stubGlobal("SpeechRecognition", MockSR);

    render(<SpeechRecognitionDisplay />);
    expect(screen.getByTestId("supported").textContent).toBe("true");
  });

  it("sets listening true after start is called", () => {
    const mockInstance = {
      continuous: false,
      interimResults: false,
      lang: "",
      onresult: null as ((e: unknown) => void) | null,
      onend: null as (() => void) | null,
      start: vi.fn(),
      stop: vi.fn(),
    };
    class MockSR {
      continuous = mockInstance.continuous;
      interimResults = mockInstance.interimResults;
      lang = mockInstance.lang;
      get onresult() { return mockInstance.onresult; }
      set onresult(v) { mockInstance.onresult = v; }
      get onend() { return mockInstance.onend; }
      set onend(v) { mockInstance.onend = v; }
      start = mockInstance.start;
      stop = mockInstance.stop;
    }
    vi.stubGlobal("SpeechRecognition", MockSR);

    render(<SpeechRecognitionDisplay />);
    expect(screen.getByTestId("listening").textContent).toBe("false");

    act(() => {
      screen.getByTestId("start").click();
    });

    expect(screen.getByTestId("listening").textContent).toBe("true");
  });

  it("sets listening false after stop is called", () => {
    const mockInstance = {
      continuous: false,
      interimResults: false,
      lang: "",
      onresult: null as ((e: unknown) => void) | null,
      onend: null as (() => void) | null,
      start: vi.fn(),
      stop: vi.fn(),
    };
    class MockSR {
      continuous = mockInstance.continuous;
      interimResults = mockInstance.interimResults;
      lang = mockInstance.lang;
      get onresult() { return mockInstance.onresult; }
      set onresult(v) { mockInstance.onresult = v; }
      get onend() { return mockInstance.onend; }
      set onend(v) { mockInstance.onend = v; }
      start = mockInstance.start;
      stop = mockInstance.stop;
    }
    vi.stubGlobal("SpeechRecognition", MockSR);

    render(<SpeechRecognitionDisplay />);

    act(() => {
      screen.getByTestId("start").click();
    });

    expect(screen.getByTestId("listening").textContent).toBe("true");

    act(() => {
      screen.getByTestId("stop").click();
    });

    expect(screen.getByTestId("listening").textContent).toBe("false");
  });

  it("updates transcript on onresult", () => {
    const mockInstance = {
      continuous: false,
      interimResults: false,
      lang: "",
      onresult: null as ((e: unknown) => void) | null,
      onend: null as (() => void) | null,
      start: vi.fn(),
      stop: vi.fn(),
    };
    class MockSR {
      continuous = mockInstance.continuous;
      interimResults = mockInstance.interimResults;
      lang = mockInstance.lang;
      get onresult() { return mockInstance.onresult; }
      set onresult(v) { mockInstance.onresult = v; }
      get onend() { return mockInstance.onend; }
      set onend(v) { mockInstance.onend = v; }
      start = mockInstance.start;
      stop = mockInstance.stop;
    }
    vi.stubGlobal("SpeechRecognition", MockSR);

    render(<SpeechRecognitionDisplay />);
    expect(screen.getByTestId("transcript").textContent).toBe("");

    act(() => {
      if (mockInstance.onresult) {
        mockInstance.onresult({
          results: [
            [{ transcript: "hello world" }],
          ],
        });
      }
    });

    expect(screen.getByTestId("transcript").textContent).toBe("hello world");
  });

  it("resets transcript to empty string", () => {
    const mockInstance = {
      continuous: false,
      interimResults: false,
      lang: "",
      onresult: null as ((e: unknown) => void) | null,
      onend: null as (() => void) | null,
      start: vi.fn(),
      stop: vi.fn(),
    };
    class MockSR {
      continuous = mockInstance.continuous;
      interimResults = mockInstance.interimResults;
      lang = mockInstance.lang;
      get onresult() { return mockInstance.onresult; }
      set onresult(v) { mockInstance.onresult = v; }
      get onend() { return mockInstance.onend; }
      set onend(v) { mockInstance.onend = v; }
      start = mockInstance.start;
      stop = mockInstance.stop;
    }
    vi.stubGlobal("SpeechRecognition", MockSR);

    render(<SpeechRecognitionDisplay />);

    act(() => {
      if (mockInstance.onresult) {
        mockInstance.onresult({
          results: [[{ transcript: "some text" }]],
        });
      }
    });

    expect(screen.getByTestId("transcript").textContent).toBe("some text");

    act(() => {
      screen.getByTestId("reset").click();
    });

    expect(screen.getByTestId("transcript").textContent).toBe("");
  });
});
