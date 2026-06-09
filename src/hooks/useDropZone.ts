import { useEffect, useRef, useState, RefObject } from "react";

interface UseDropZoneOptions {
  onDrop: (files: FileList) => void;
  onDragOver?: () => void;
  onDragLeave?: () => void;
}

interface DropZoneState {
  isOver: boolean;
}

export function useDropZone<T extends HTMLElement>(
  ref: RefObject<T>,
  options: UseDropZoneOptions
): DropZoneState {
  const [isOver, setIsOver] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsOver(true);
      optionsRef.current.onDragOver?.();
    };

    const handleDragLeave = () => {
      setIsOver(false);
      optionsRef.current.onDragLeave?.();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      if (e.dataTransfer?.files.length) {
        optionsRef.current.onDrop(e.dataTransfer.files);
      }
    };

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [ref]);

  return { isOver };
}
