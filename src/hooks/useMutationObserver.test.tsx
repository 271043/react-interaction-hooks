import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useRef } from "react";
import { useMutationObserver } from "./useMutationObserver";

let mutationCallback: MutationCallback;
const mockMO = { observe: vi.fn(), disconnect: vi.fn() };

function TestComponent({
  callback,
  options,
}: {
  callback: MutationCallback;
  options?: MutationObserverInit;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMutationObserver(ref, callback, options);
  return <div ref={ref} />;
}

describe("useMutationObserver", () => {
  beforeEach(() => {
    vi.stubGlobal("MutationObserver", class {
      constructor(cb: MutationCallback) { mutationCallback = cb; }
      observe = mockMO.observe;
      disconnect = mockMO.disconnect;
    });
    mockMO.observe.mockClear();
    mockMO.disconnect.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls observe on mount with the correct element and default options", () => {
    const cb = vi.fn();
    render(<TestComponent callback={cb} />);
    expect(mockMO.observe).toHaveBeenCalledTimes(1);
    const [observedEl, observedOptions] = mockMO.observe.mock.calls[0];
    expect(observedEl).toBeInstanceOf(HTMLDivElement);
    expect(observedOptions).toEqual({ childList: true, subtree: true });
  });

  it("calls observe with custom options when provided", () => {
    const cb = vi.fn();
    const opts: MutationObserverInit = { attributes: true, childList: false, subtree: false };
    render(<TestComponent callback={cb} options={opts} />);
    const [, observedOptions] = mockMO.observe.mock.calls[0];
    expect(observedOptions).toEqual(opts);
  });

  it("calls the callback when mutations fire", () => {
    const cb = vi.fn();
    render(<TestComponent callback={cb} />);

    const fakeMutations = [{ type: "childList" }] as unknown as MutationRecord[];
    act(() => {
      mutationCallback(fakeMutations, mockMO as unknown as MutationObserver);
    });

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(fakeMutations, expect.anything());
  });

  it("disconnects observer on unmount", () => {
    const cb = vi.fn();
    const { unmount } = render(<TestComponent callback={cb} />);
    unmount();
    expect(mockMO.disconnect).toHaveBeenCalledTimes(1);
  });
});
