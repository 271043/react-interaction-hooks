import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useRef } from "react";
import { useDropZone } from "./useDropZone";

function TestComponent({
  onDrop,
  onDragOver,
  onDragLeave,
}: {
  onDrop: (files: FileList) => void;
  onDragOver?: () => void;
  onDragLeave?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isOver } = useDropZone(ref, { onDrop, onDragOver, onDragLeave });
  return (
    <div ref={ref} data-testid="dropzone">
      {isOver ? "over" : "idle"}
    </div>
  );
}

function makeDragEvent(type: string, files?: File[]) {
  const dataTransfer = {
    files: files
      ? Object.assign(files, { item: (i: number) => files[i], length: files.length })
      : Object.assign([], { item: () => null, length: 0 }),
    types: ["Files"],
  };
  return { dataTransfer };
}

describe("useDropZone", () => {
  let onDrop: (files: FileList) => void;
  let onDragOver: () => void;
  let onDragLeave: () => void;

  beforeEach(() => {
    onDrop = vi.fn() as unknown as (files: FileList) => void;
    onDragOver = vi.fn() as unknown as () => void;
    onDragLeave = vi.fn() as unknown as () => void;
  });

  it("isOver becomes true on dragover", () => {
    render(<TestComponent onDrop={onDrop} />);
    const el = screen.getByTestId("dropzone");
    fireEvent.dragOver(el);
    expect(el.textContent).toBe("over");
  });

  it("isOver becomes false on dragleave", () => {
    render(<TestComponent onDrop={onDrop} />);
    const el = screen.getByTestId("dropzone");
    fireEvent.dragOver(el);
    fireEvent.dragLeave(el);
    expect(el.textContent).toBe("idle");
  });

  it("onDrop is called on drop with FileList", () => {
    render(<TestComponent onDrop={onDrop} />);
    const el = screen.getByTestId("dropzone");
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const fileList = Object.assign([file], {
      item: (i: number) => [file][i],
      length: 1,
    }) as unknown as FileList;

    fireEvent.drop(el, { dataTransfer: { files: fileList } });
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop).toHaveBeenCalledWith(fileList);
  });

  it("onDragOver callback fires on dragover", () => {
    render(<TestComponent onDrop={onDrop} onDragOver={onDragOver} />);
    fireEvent.dragOver(screen.getByTestId("dropzone"));
    expect(onDragOver).toHaveBeenCalledTimes(1);
  });

  it("onDragLeave callback fires on dragleave", () => {
    render(<TestComponent onDrop={onDrop} onDragLeave={onDragLeave} />);
    const el = screen.getByTestId("dropzone");
    fireEvent.dragOver(el);
    fireEvent.dragLeave(el);
    expect(onDragLeave).toHaveBeenCalledTimes(1);
  });

  it("dragover event has preventDefault called", () => {
    render(<TestComponent onDrop={onDrop} />);
    const el = screen.getByTestId("dropzone");
    const spy = vi.spyOn(Event.prototype, "preventDefault");
    fireEvent.dragOver(el);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("drop event has preventDefault called", () => {
    render(<TestComponent onDrop={onDrop} />);
    const el = screen.getByTestId("dropzone");
    const spy = vi.spyOn(Event.prototype, "preventDefault");
    fireEvent.drop(el);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
