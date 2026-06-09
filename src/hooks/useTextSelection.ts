import { useEffect, useState } from "react";

interface TextSelectionState {
  text: string;
  rect: DOMRect | null;
}

export function useTextSelection(): TextSelectionState {
  const [selection, setSelection] = useState<TextSelectionState>({ text: "", rect: null });

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setSelection({ text: "", rect: null });
        return;
      }
      setSelection({
        text: sel.toString(),
        rect: sel.getRangeAt(0).getBoundingClientRect(),
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  return selection;
}
