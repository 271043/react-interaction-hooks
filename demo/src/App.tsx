import { useRef, useState, CSSProperties, ReactNode } from "react";
import {
  useOutsideClick, useScrollLock, useHover, useKeyCombo, useLongPress,
  useDrag, useSwipe, useDoubleTap, usePinch, usePointerPosition,
  useKeyPress, useFocusTrap, useArrowNavigation, useFocusWithin,
  useIntersectionObserver, useIdle, useCopyToClipboard, useMediaQuery,
  useScrollPosition, useScrollDirection, useScrollProgress,
  useResizeObserver, useWindowSize, useDropZone, useContextMenu,
  useMouseLeaveWindow, useDeviceOrientation, useGeolocation,
  useNetworkStatus, useBattery, useVibrate, usePageVisibility, useTextSelection,
  useDebounce, useThrottle, useInterval, useTimeout, useAnimationFrame,
  useCountdown, useMutationObserver, useElementSize, useElementPosition,
  useFullscreen, useWakeLock, usePaste, useDoubleClick, usePointerLock,
  useKeySequence, useScrollIntoView, useScrollSpy, useInfiniteScroll,
  useShare, usePermission, useNotification, useReducedMotion, useColorScheme,
  useGamepad, useSpeechRecognition, useSpeechSynthesis, useEyeDropper,
  useFocusReturn, useTabFocus, useContainerQuery,
} from "hookset";
import {
  Mouse, Hand, Keyboard, Eye, EyeOff, ScrollText, Maximize2, Clipboard,
  Cpu, Lock, LockOpen, Check, Moon, Sun, Smartphone, Monitor, ArrowDown,
  ArrowUp, FolderOpen, Folder, Zap, Battery, Package, Loader2,
  MoveHorizontal, Wifi, WifiOff, ClipboardCopy, Move,
  Timer, Mic, MicOff, Volume2, Gamepad2, Pipette, Bell, BellOff,
  Share2, Maximize, MousePointerClick, Play, Square, RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Tokenizer ────────────────────────────────────────────────────────────────

type TType = "kw" | "hook" | "str" | "cmt" | "num" | "plain";
const KWDS = new Set([
  "const","let","var","function","return","import","from","export","default",
  "type","interface","if","else","null","undefined","true","false","void",
  "boolean","number","string","async","await","new","typeof","of","in","as",
]);
function tokenize(src: string): Array<{ t: TType; v: string }> {
  const out: Array<{ t: TType; v: string }> = [];
  let i = 0;
  while (i < src.length) {
    const r = src.slice(i);
    if (r.startsWith("//")) {
      const nl = r.indexOf("\n"); const val = nl < 0 ? r : r.slice(0, nl);
      out.push({ t: "cmt", v: val }); i += val.length; continue;
    }
    if (r.startsWith("/*")) {
      const end = r.indexOf("*/"); const val = end < 0 ? r : r.slice(0, end + 2);
      out.push({ t: "cmt", v: val }); i += val.length; continue;
    }
    const q = r[0];
    if (q === '"' || q === "'" || q === "`") {
      let j = 1;
      while (j < r.length) {
        if (r[j] === "\\") { j += 2; continue; }
        if (r[j] === q) { j++; break; }
        j++;
      }
      out.push({ t: "str", v: r.slice(0, j) }); i += j; continue;
    }
    const id = r.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (id) {
      const w = id[0];
      out.push({ t: KWDS.has(w) ? "kw" : /^use[A-Z]/.test(w) ? "hook" : "plain", v: w });
      i += w.length; continue;
    }
    const nm = r.match(/^\d+(?:\.\d+)?/);
    if (nm) { out.push({ t: "num", v: nm[0] }); i += nm[0].length; continue; }
    out.push({ t: "plain", v: r[0] }); i++;
  }
  return out;
}
const TC: Record<TType, string> = {
  kw: "#81a1c1", hook: "#88c0d0", str: "#a3be8c",
  cmt: "#616e88", num: "#b48ead", plain: "#d8dee9",
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const MONO = '"JetBrains Mono", "Fira Code", Consolas, monospace';

const s = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    color: "#0f172a",
  } as CSSProperties,

  header: {
    background: "#0f172a",
    color: "#f1f5f9",
    padding: "0 32px",
    height: "60px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 100,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
  } as CSSProperties,

  headerLeft: {
    display: "flex", flexDirection: "column" as const, gap: "2px",
  } as CSSProperties,

  headerTitle: {
    fontSize: "17px", fontWeight: 700, letterSpacing: "-0.03em", color: "#f1f5f9",
  } as CSSProperties,

  headerSub: {
    fontSize: "13px", color: "#64748b", letterSpacing: "-0.01em",
  } as CSSProperties,

  headerBadge: {
    padding: "6px 14px", borderRadius: "9px", fontSize: "13px", fontWeight: 700,
    background: "rgba(204,53,52,0.12)", color: "#f87171",
    border: "1px solid rgba(204,53,52,0.3)",
    textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
    letterSpacing: "0.01em",
  } as CSSProperties,

  layout: { display: "grid", gridTemplateColumns: "260px 1fr" } as CSSProperties,

  sidebar: {
    background: "#fff",
    borderRight: "1px solid #e8ecf0",
    padding: "16px 0 24px",
    position: "sticky", top: "60px",
    height: "calc(100vh - 60px)",
    overflowY: "auto",
  } as CSSProperties,

  sidebarLabel: {
    padding: "0 20px 6px",
    fontSize: "10px", fontWeight: 700, color: "#94a3b8",
    letterSpacing: "0.08em", textTransform: "uppercase" as const,
  } as CSSProperties,

  navItem: (active: boolean): CSSProperties => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 22px",
    cursor: "pointer", fontSize: "14px",
    color: active ? "#4f46e5" : "#64748b",
    fontWeight: active ? 600 : 400,
    background: active ? "#eef2ff" : "transparent",
    borderLeft: `2px solid ${active ? "#6366f1" : "transparent"}`,
    border: "none", width: "100%", textAlign: "left",
    letterSpacing: "-0.01em",
  }),

  navCount: (active: boolean): CSSProperties => ({
    marginLeft: "auto", fontSize: "11px", fontWeight: 600,
    color: active ? "#6366f1" : "#cbd5e1",
    background: active ? "#e0e7ff" : "transparent",
    padding: active ? "1px 6px" : "0",
    borderRadius: "999px",
  }),

  content: { padding: "44px 52px" } as CSSProperties,
  section: { marginBottom: "60px", scrollMarginTop: "76px" } as CSSProperties,

  sectionTitle: {
    display: "flex", alignItems: "center", gap: "10px",
    fontSize: "18px", fontWeight: 700, marginBottom: "22px",
    paddingBottom: "16px", borderBottom: "1px solid #e8ecf0",
    letterSpacing: "-0.03em", color: "#0f172a",
  } as CSSProperties,

  sectionCount: {
    fontSize: "11px", fontWeight: 600, color: "#94a3b8",
    background: "#f1f5f9", padding: "2px 8px",
    borderRadius: "999px", border: "1px solid #e2e8f0",
    marginLeft: "2px",
  } as CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "16px",
  } as CSSProperties,

  card: {
    background: "#fff",
    border: "1px solid #e8ecf0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)",
  } as CSSProperties,

  cardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "8px", marginBottom: "12px",
  } as CSSProperties,

  hookBadge: {
    fontSize: "13px", fontWeight: 600,
    color: "#4f46e5", fontFamily: MONO,
    background: "#eef2ff",
    padding: "4px 11px", borderRadius: "7px",
    border: "1px solid #c7d2fe",
    letterSpacing: "-0.02em",
  } as CSSProperties,

  hint: {
    fontSize: "13px", color: "#94a3b8",
    marginBottom: "12px", letterSpacing: "-0.01em",
  } as CSSProperties,

  val: {
    fontSize: "14px", fontFamily: MONO,
    background: "#f8fafc",
    border: "1px solid #e8ecf0",
    padding: "10px 14px", borderRadius: "10px",
    marginTop: "14px", wordBreak: "break-all" as const,
    color: "#475569", lineHeight: 1.6,
  } as CSSProperties,

  box: (extra?: CSSProperties): CSSProperties => ({
    height: "108px", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: 500,
    border: "1.5px dashed #cbd5e1",
    cursor: "pointer", userSelect: "none" as const,
    transition: "all 0.18s ease",
    color: "#64748b", ...extra,
  }),

  btn: (extra?: CSSProperties): CSSProperties => ({
    padding: "10px 18px", borderRadius: "9px", border: "none",
    background: "#6366f1", color: "#fff", cursor: "pointer",
    fontSize: "14px", fontWeight: 600, letterSpacing: "-0.01em",
    display: "inline-flex", alignItems: "center", gap: "7px",
    transition: "opacity 0.15s", ...extra,
  }),

  chip: (on: boolean): CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "5px 13px", borderRadius: "999px",
    fontSize: "13px", fontWeight: 600,
    background: on ? "#f0fdf4" : "#f8fafc",
    color: on ? "#15803d" : "#64748b",
    border: `1px solid ${on ? "#bbf7d0" : "#e2e8f0"}`,
  }),

  codeToggle: (open: boolean): CSSProperties => ({
    padding: "4px 11px", borderRadius: "7px",
    border: `1px solid ${open ? "#c7d2fe" : "#e8ecf0"}`,
    background: open ? "#eef2ff" : "#f8fafc",
    color: open ? "#6366f1" : "#94a3b8",
    cursor: "pointer", fontSize: "12px", fontWeight: 600,
    lineHeight: "20px", flexShrink: 0,
    display: "flex", alignItems: "center", gap: "4px",
  }),
};

// ─── CodeBlock ────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div style={{ position: "relative", background: "#1e2433", borderRadius: "10px", padding: "16px", marginTop: "14px", overflow: "hidden", border: "1px solid #2d3549" }}>
      <button
        onClick={() => copy(code.trim())}
        style={{
          position: "absolute", top: "10px", right: "10px",
          padding: "3px 9px", borderRadius: "5px",
          border: "1px solid #374151",
          background: copied ? "#1a3a2a" : "#2d3549",
          color: copied ? "#6ee7b7" : "#9099a6",
          cursor: "pointer", fontSize: "10.5px", fontWeight: 600,
          display: "inline-flex", alignItems: "center", gap: "4px",
          letterSpacing: "-0.01em",
        }}
      >
        {copied ? <><Check size={10} /> copied</> : "copy"}
      </button>
      <pre style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.75, fontFamily: MONO, whiteSpace: "pre", overflowX: "auto", paddingRight: "52px" }}>
        <code>
          {tokenize(code.trim()).map((tk, i) => (
            <span key={i} style={{ color: TC[tk.t] }}>{tk.v}</span>
          ))}
        </code>
      </pre>
    </div>
  );
}

// ─── DemoCard ─────────────────────────────────────────────────────────────────

function DemoCard({ hookName, code, hint, children }: {
  hookName: string; code: string; hint?: string; children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.hookBadge}>{hookName}</span>
        <button style={s.codeToggle(showCode)} onClick={() => setShowCode(v => !v)}>
          {showCode ? "▲ hide" : "</> code"}
        </button>
      </div>
      {hint && <div style={s.hint}>{hint}</div>}
      {children}
      {showCode && <CodeBlock code={code} />}
    </div>
  );
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function StatusVal({ ok, yes, no, extra }: { ok: boolean; yes: string; no: string; extra?: string }) {
  return (
    <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "7px", background: ok ? "#f0fdf4" : "#fef2f2", border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`, color: ok ? "#15803d" : "#b91c1c" }}>
      {ok ? <Check size={13} /> : <EyeOff size={13} />}
      {ok ? yes : no}{extra}
    </div>
  );
}

// ─── Demo cards ──────────────────────────────────────────────────────────────

function OutsideClickDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useOutsideClick(ref, () => setN((c) => c + 1));
  return (
    <DemoCard hookName="useOutsideClick" code={
`const ref = useRef(null)
useOutsideClick(ref, () => setOpen(false))`}>
      <div ref={ref} style={s.box({ background: "#f0f9ff", borderColor: "#bae6fd" })}>Click outside me</div>
      <div style={s.val}>Outside clicks: <strong>{n}</strong></div>
    </DemoCard>
  );
}

function ScrollLockDemo() {
  const [locked, setLocked] = useState(false);
  useScrollLock(locked);
  return (
    <DemoCard hookName="useScrollLock" code={`useScrollLock(isModalOpen)`}>
      <button style={s.btn({ background: locked ? "#dc2626" : "#6366f1" })} onClick={() => setLocked((l) => !l)}>
        {locked ? <><Lock size={13} /> Unlock Scroll</> : <><LockOpen size={13} /> Lock Scroll</>}
      </button>
    </DemoCard>
  );
}

function HoverDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const hovered = useHover(ref);
  return (
    <DemoCard hookName="useHover" code={
`const ref = useRef(null)
const hovered = useHover(ref, { enterDelay: 200 })`}>
      <div ref={ref} style={s.box({ background: hovered ? "#f0fdf4" : "#f8fafc", borderColor: hovered ? "#86efac" : "#cbd5e1", color: hovered ? "#15803d" : "#94a3b8" })}>
        {hovered
          ? <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Check size={14} /> Hovering</span>
          : "Hover me"}
      </div>
    </DemoCard>
  );
}

function KeyComboDemo() {
  const [last, setLast] = useState<string | null>(null);
  useKeyCombo("ctrl+k", () => setLast("Ctrl+K"));
  useKeyCombo("ctrl+shift+p", () => setLast("Ctrl+Shift+P"));
  useKeyCombo("alt+s", () => setLast("Alt+S"));
  return (
    <DemoCard hookName="useKeyCombo" hint="Try: Ctrl+K · Ctrl+Shift+P · Alt+S" code={
`useKeyCombo("ctrl+k", () => openSearch())
useKeyCombo("ctrl+shift+p", openCommandPalette)
useKeyCombo("escape", closeModal)`}>
      <div style={s.val}>{last ? <><Check size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />{last}</> : <span style={{ color: "#94a3b8" }}>press a combo…</span>}</div>
    </DemoCard>
  );
}

function LongPressDemo() {
  const ref = useRef<HTMLButtonElement>(null);
  const [msg, setMsg] = useState("Hold me (600ms)");
  useLongPress(ref, () => setMsg("Long pressed!"), {
    threshold: 600,
    onStart: () => setMsg("Holding…"),
    onCancel: () => setMsg("Hold me (600ms)"),
  });
  return (
    <DemoCard hookName="useLongPress" code={
`const ref = useRef(null)
useLongPress(ref, () => deleteItem(), {
  threshold: 600,
  onStart: () => showProgress(),
  onCancel: () => hideProgress(),
})`}>
      <button ref={ref} style={s.btn({ width: "100%", padding: "14px", justifyContent: "center" })}>{msg}</button>
    </DemoCard>
  );
}

function DragDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { isDragging, delta, position } = useDrag(ref);
  return (
    <DemoCard hookName="useDrag" code={
`const ref = useRef(null)
const { isDragging, delta, position } = useDrag(ref)`}>
      <div ref={ref} style={s.box({ background: isDragging ? "#fffbeb" : "#f8fafc", borderColor: isDragging ? "#fcd34d" : "#cbd5e1", cursor: isDragging ? "grabbing" : "grab" })}>
        {isDragging
          ? <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Move size={14} /> Dragging</span>
          : <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MoveHorizontal size={14} /> Drag me</span>}
      </div>
      <div style={s.val}>Δ ({delta.x.toFixed(0)}, {delta.y.toFixed(0)}) · pos ({position.x.toFixed(0)}, {position.y.toFixed(0)})</div>
    </DemoCard>
  );
}

function SwipeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [dir, setDir] = useState<string | null>(null);
  useSwipe(ref, { onSwipe: setDir });
  return (
    <DemoCard hookName="useSwipe" hint="Touch device: swipe inside the box" code={
`const ref = useRef(null)
useSwipe(ref, {
  onSwipe: (dir) => console.log(dir),
  threshold: 50,
})`}>
      <div ref={ref} style={s.box({ background: "#f0f9ff", height: "90px", touchAction: "none", borderColor: "#bae6fd" })}>Swipe here</div>
      <div style={s.val}>{dir ? `Direction: ${dir}` : <span style={{ color: "#94a3b8" }}>waiting for swipe…</span>}</div>
    </DemoCard>
  );
}

function DoubleTapDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useDoubleTap(ref, () => setN((c) => c + 1));
  return (
    <DemoCard hookName="useDoubleTap" hint="Touch device: double-tap the box" code={
`const ref = useRef(null)
useDoubleTap(ref, () => like(), { threshold: 300 })`}>
      <div ref={ref} style={s.box({ background: "#fdf4ff", borderColor: "#e9d5ff" })}>Double-tap here</div>
      <div style={s.val}>Double taps: <strong>{n}</strong></div>
    </DemoCard>
  );
}

function PinchDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  usePinch(ref, { onPinch: ({ scale: sc }) => setScale(sc), onPinchEnd: () => setScale(1) });
  return (
    <DemoCard hookName="usePinch" hint="Touch device: pinch inside the box" code={
`const ref = useRef(null)
usePinch(ref, {
  onPinch: ({ scale }) => setScale(scale),
  onPinchEnd: () => setScale(1),
})`}>
      <div ref={ref} style={s.box({ background: "#fff7ed", height: "90px", touchAction: "none", borderColor: "#fed7aa" })}>
        <span style={{ transform: `scale(${scale})`, display: "inline-flex", transition: "transform 0.05s" }}>
          <Package size={30} color="#f97316" />
        </span>
      </div>
      <div style={s.val}>Scale: {scale.toFixed(2)}×</div>
    </DemoCard>
  );
}

function PointerPositionDemo() {
  const { clientX, clientY } = usePointerPosition();
  return (
    <DemoCard hookName="usePointerPosition" hint="Move mouse anywhere on the page" code={
`const { x, y, clientX, clientY } = usePointerPosition()
// x/y: page-relative · clientX/clientY: viewport-relative`}>
      <div style={s.val}>x: {clientX} · y: {clientY}</div>
    </DemoCard>
  );
}

function KeyPressDemo() {
  const shift = useKeyPress("Shift");
  const ctrl = useKeyPress("Control");
  const alt = useKeyPress("Alt");
  const meta = useKeyPress("Meta");
  return (
    <DemoCard hookName="useKeyPress" hint="Hold modifier keys" code={
`const isShiftHeld = useKeyPress("Shift")
const isEscape = useKeyPress("Escape")`}>
      <div style={{ display: "flex", gap: "7px", marginTop: "4px", flexWrap: "wrap" }}>
        {([["Shift", shift], ["Ctrl", ctrl], ["Alt", alt], ["Meta", meta]] as [string, boolean][]).map(([k, v]) => (
          <span key={k} style={s.chip(v)}>
            {v && <Check size={11} />}{k}
          </span>
        ))}
      </div>
    </DemoCard>
  );
}

function FocusTrapDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useFocusTrap(ref, isOpen);
  return (
    <DemoCard hookName="useFocusTrap" code={
`const ref = useRef(null)
useFocusTrap(ref, isModalOpen)`}>
      <button style={s.btn()} onClick={() => setIsOpen(true)}>Open modal</button>
      {isOpen && (
        <div ref={ref} style={{ marginTop: "12px", padding: "16px", background: "#f0f9ff", borderRadius: "10px", border: "1.5px solid #7dd3fc" }}>
          <div style={{ marginBottom: "10px", fontWeight: 600, fontSize: "13px", color: "#0369a1" }}>Tab is trapped inside ↩</div>
          <input style={{ padding: "6px 10px", marginRight: "8px", borderRadius: "6px", border: "1px solid #bae6fd", fontSize: "13px" }} placeholder="Input 1" />
          <input style={{ padding: "6px 10px", marginRight: "8px", borderRadius: "6px", border: "1px solid #bae6fd", fontSize: "13px" }} placeholder="Input 2" />
          <br />
          <button style={{ ...s.btn({ background: "#dc2626", marginTop: "10px" }) }} onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </DemoCard>
  );
}

function ArrowNavDemo() {
  const ref = useRef<HTMLUListElement>(null);
  useArrowNavigation(ref);
  return (
    <DemoCard hookName="useArrowNavigation" hint="Click an item then use ↑↓" code={
`const ref = useRef(null)
useArrowNavigation(ref, {
  orientation: "vertical",
  loop: true,
})`}>
      <ul ref={ref} style={{ listStyle: "none", marginTop: "4px" }}>
        {["Apple", "Banana", "Cherry", "Durian"].map((item) => (
          <li key={item} tabIndex={0}
            style={{ padding: "7px 12px", borderRadius: "7px", marginBottom: "3px", cursor: "pointer", outline: "none", fontSize: "13px", fontWeight: 500, transition: "background 0.1s", color: "#374151" }}
            onFocus={(e) => (e.currentTarget.style.background = "#dbeafe")}
            onBlur={(e) => (e.currentTarget.style.background = "transparent")}>
            {item}
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}

function FocusWithinDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const within = useFocusWithin(ref);
  return (
    <DemoCard hookName="useFocusWithin" code={
`const ref = useRef(null)
const active = useFocusWithin(ref)`}>
      <div ref={ref} style={{ padding: "10px", border: `2px solid ${within ? "#86efac" : "#e2e8f0"}`, borderRadius: "10px", transition: "border-color 0.2s", background: within ? "#f0fdf4" : "#fff" }}>
        <input style={{ padding: "7px 10px", width: "100%", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none", background: "transparent" }} placeholder="Focus inside me" />
      </div>
      <StatusVal ok={within} yes="Focus within" no="No focus" />
    </DemoCard>
  );
}

function IntersectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { isIntersecting, ratio } = useIntersectionObserver(ref, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  return (
    <DemoCard hookName="useIntersectionObserver" hint="Scroll the page" code={
`const ref = useRef(null)
const { isIntersecting, ratio } = useIntersectionObserver(ref, {
  threshold: 0.5,
})`}>
      <div ref={ref} style={s.box({ background: isIntersecting ? "#f0fdf4" : "#fef2f2", borderColor: isIntersecting ? "#86efac" : "#fca5a5" })}>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", color: isIntersecting ? "#15803d" : "#b91c1c" }}>
          {isIntersecting ? <><Eye size={14} /> In viewport</> : <><EyeOff size={14} /> Out of viewport</>}
        </span>
      </div>
      <div style={s.val}>
        <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
          <div style={{ height: "100%", background: isIntersecting ? "#22c55e" : "#e2e8f0", width: `${ratio * 100}%`, transition: "width 0.15s" }} />
        </div>
        Ratio: {(ratio * 100).toFixed(0)}%
      </div>
    </DemoCard>
  );
}

function IdleDemo() {
  const idle = useIdle(3000);
  return (
    <DemoCard hookName="useIdle" hint="Stop all input for 3 seconds" code={
`const isIdle = useIdle(30_000) // 30 seconds
if (isIdle) lockScreen()`}>
      <StatusVal ok={!idle} yes="Active" no="Idle" />
    </DemoCard>
  );
}

function CopyDemo() {
  const { copied, copy } = useCopyToClipboard();
  return (
    <DemoCard hookName="useCopyToClipboard" code={
`const { copied, copy } = useCopyToClipboard()
// resetDelay defaults to 2000ms
copy("Hello!")`}>
      <button style={s.btn({ background: copied ? "#16a34a" : "#6366f1" })} onClick={() => copy("Hello from hookset!")}>
        {copied ? <><Check size={13} /> Copied!</> : <><ClipboardCopy size={13} /> Copy to clipboard</>}
      </button>
    </DemoCard>
  );
}

function MediaQueryDemo() {
  const dark = useMediaQuery("(prefers-color-scheme: dark)");
  const mobile = useMediaQuery("(max-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return (
    <DemoCard hookName="useMediaQuery" code={
`const isDark = useMediaQuery("(prefers-color-scheme: dark)")
const isMobile = useMediaQuery("(max-width: 768px)")`}>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "4px" }}>
        <span style={s.chip(dark)}><Moon size={11} />{dark ? "Dark" : "Light"}</span>
        <span style={s.chip(mobile)}>{mobile ? <Smartphone size={11} /> : <Monitor size={11} />}{mobile ? "Mobile" : "Desktop"}</span>
        <span style={s.chip(reduced)}>{reduced ? "Reduced motion" : "Motion ok"}</span>
      </div>
    </DemoCard>
  );
}

function ScrollPositionDemo() {
  const { x, y } = useScrollPosition();
  return (
    <DemoCard hookName="useScrollPosition" hint="Scroll the page" code={`const { x, y } = useScrollPosition()`}>
      <div style={s.val}>x: {x.toFixed(0)} · y: {y.toFixed(0)}</div>
    </DemoCard>
  );
}

function ScrollDirectionDemo() {
  const dir = useScrollDirection();
  return (
    <DemoCard hookName="useScrollDirection" hint="Scroll the page" code={`const dir = useScrollDirection() // "up" | "down" | null`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "7px" }}>
        {dir === "down" ? <><ArrowDown size={13} /> Down</> : dir === "up" ? <><ArrowUp size={13} /> Up</> : <span style={{ color: "#94a3b8" }}>not scrolled yet</span>}
      </div>
    </DemoCard>
  );
}

function ScrollProgressDemo() {
  const p = useScrollProgress();
  return (
    <DemoCard hookName="useScrollProgress" hint="Scroll the page" code={
`const progress = useScrollProgress()      // page
const progress = useScrollProgress(ref)   // element`}>
      <div style={{ marginTop: "8px" }}>
        <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", width: `${p * 100}%`, transition: "width 0.1s", borderRadius: "3px" }} />
        </div>
        <div style={{ ...s.val, marginTop: "8px" }}>{(p * 100).toFixed(1)}%</div>
      </div>
    </DemoCard>
  );
}

function ResizeObserverDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(ref);
  return (
    <DemoCard hookName="useResizeObserver" code={
`const ref = useRef(null)
const { width, height } = useResizeObserver(ref)`}>
      <div ref={ref} style={{ resize: "both", overflow: "auto", border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "14px", minHeight: "72px", minWidth: "130px", fontSize: "13px", color: "#94a3b8", background: "#f8fafc" }}>
        ↘ Drag to resize
      </div>
      <div style={s.val}>{width.toFixed(0)} × {height.toFixed(0)} px</div>
    </DemoCard>
  );
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize();
  return (
    <DemoCard hookName="useWindowSize" hint="Resize the browser window" code={`const { width, height } = useWindowSize()`}>
      <div style={s.val}>{width} × {height} px</div>
    </DemoCard>
  );
}

function DropZoneDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const { isOver } = useDropZone(ref, { onDrop: (fl) => setFiles(Array.from(fl).map((f) => f.name)) });
  return (
    <DemoCard hookName="useDropZone" code={
`const ref = useRef(null)
const { isOver } = useDropZone(ref, {
  onDrop: (files) => uploadFiles(files),
})`}>
      <div ref={ref} style={s.box({ height: "90px", background: isOver ? "#eff6ff" : "#f8fafc", borderColor: isOver ? "#93c5fd" : "#cbd5e1" })}>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", color: isOver ? "#1d4ed8" : "#94a3b8" }}>
          {isOver ? <FolderOpen size={16} /> : <Folder size={16} />}
          {isOver ? "Drop files!" : "Drop files here"}
        </span>
      </div>
      {files.length > 0 && <div style={s.val}>{files.join(", ")}</div>}
    </DemoCard>
  );
}

function ContextMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useContextMenu(ref, (e) => setPos({ x: e.clientX, y: e.clientY }));
  return (
    <DemoCard hookName="useContextMenu" code={
`const ref = useRef(null)
useContextMenu(ref, (e) => {
  openMenu(e.clientX, e.clientY)
})`}>
      <div ref={ref} style={s.box({ background: "#fdf4ff", borderColor: "#e9d5ff" })}>Right-click me</div>
      <div style={s.val}>{pos ? `x: ${pos.x} · y: ${pos.y}` : <span style={{ color: "#94a3b8" }}>right-click above…</span>}</div>
    </DemoCard>
  );
}

function MouseLeaveWindowDemo() {
  const [n, setN] = useState(0);
  useMouseLeaveWindow(() => setN((c) => c + 1));
  return (
    <DemoCard hookName="useMouseLeaveWindow" hint="Move mouse outside the browser window" code={`useMouseLeaveWindow(() => setShowExitPopup(true))`}>
      <div style={s.val}>Left window: <strong>{n}×</strong></div>
    </DemoCard>
  );
}

function DeviceOrientationDemo() {
  const { alpha, beta, gamma } = useDeviceOrientation();
  return (
    <DemoCard hookName="useDeviceOrientation" hint="Tilt your device (mobile/tablet only)" code={
`const { alpha, beta, gamma } = useDeviceOrientation()
// returns null on desktop`}>
      <div style={s.val}>
        α: {alpha?.toFixed(1) ?? "—"} &nbsp;·&nbsp; β: {beta?.toFixed(1) ?? "—"} &nbsp;·&nbsp; γ: {gamma?.toFixed(1) ?? "—"}
      </div>
    </DemoCard>
  );
}

function GeolocationDemo() {
  const { loading, position, error } = useGeolocation();
  return (
    <DemoCard hookName="useGeolocation" code={
`const { loading, position, error } = useGeolocation({
  enableHighAccuracy: true,
})
const lat = position?.coords.latitude`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "7px" }}>
        {loading
          ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} /> Requesting…</>
          : error ? `Error: ${error.message}`
          : `${position?.coords.latitude.toFixed(5)}, ${position?.coords.longitude.toFixed(5)}`}
      </div>
    </DemoCard>
  );
}

function NetworkStatusDemo() {
  const { online, effectiveType } = useNetworkStatus();
  return (
    <DemoCard hookName="useNetworkStatus" code={
`const { online, effectiveType } = useNetworkStatus()
// effectiveType: "slow-2g" | "2g" | "3g" | "4g" | null`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "7px", background: online ? "#f0fdf4" : "#fef2f2", border: `1px solid ${online ? "#bbf7d0" : "#fecaca"}`, color: online ? "#15803d" : "#b91c1c" }}>
        {online ? <Wifi size={13} /> : <WifiOff size={13} />}
        {online ? "Online" : "Offline"}{effectiveType ? ` · ${effectiveType}` : ""}
      </div>
    </DemoCard>
  );
}

function BatteryDemo() {
  const { supported, loading, level, charging, dischargingTime } = useBattery();
  const pct = level !== null ? `${(level * 100).toFixed(0)}%` : "—";
  const mins = dischargingTime && isFinite(dischargingTime) ? ` · ${Math.round(dischargingTime / 60)}m left` : "";
  return (
    <DemoCard hookName="useBattery" code={
`const { supported, loading, level, charging } = useBattery()
// Chrome only`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "7px" }}>
        {!supported ? "Not supported in this browser"
          : loading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Loading…</>
          : <>{charging ? <Zap size={13} color="#eab308" /> : <Battery size={13} />} {pct}{mins}</>}
      </div>
    </DemoCard>
  );
}

function VibrateDemo() {
  const vibrate = useVibrate();
  return (
    <DemoCard hookName="useVibrate" hint="Mobile only" code={
`const vibrate = useVibrate()
vibrate(200)             // 200ms buzz
vibrate([100, 50, 100]) // pattern
vibrate(0)               // stop`}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button style={s.btn()} onClick={() => vibrate(200)}>Short buzz</button>
        <button style={s.btn()} onClick={() => vibrate([100, 80, 100, 80, 300])}>Pattern</button>
        <button style={s.btn({ background: "#dc2626" })} onClick={() => vibrate(0)}>Stop</button>
      </div>
    </DemoCard>
  );
}

function PageVisibilityDemo() {
  const visible = usePageVisibility();
  return (
    <DemoCard hookName="usePageVisibility" hint="Switch browser tabs then come back" code={
`const isVisible = usePageVisibility()
useEffect(() => {
  if (!isVisible) pauseVideo()
}, [isVisible])`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "7px", background: visible ? "#f0fdf4" : "#fef2f2", border: `1px solid ${visible ? "#bbf7d0" : "#fecaca"}`, color: visible ? "#15803d" : "#b91c1c" }}>
        {visible ? <><Eye size={13} /> Page visible</> : <><EyeOff size={13} /> Page hidden</>}
      </div>
    </DemoCard>
  );
}

function TextSelectionDemo() {
  const { text } = useTextSelection();
  return (
    <DemoCard hookName="useTextSelection" code={
`const { text, rect } = useTextSelection()
// rect: DOMRect — use for tooltip positioning`}>
      <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#64748b", margin: "0 0 10px" }}>
        Select any text anywhere on this page.
      </p>
      <div style={s.val}>{text ? `"${text.length > 50 ? text.slice(0, 50) + "…" : text}"` : <span style={{ color: "#94a3b8" }}>no selection</span>}</div>
    </DemoCard>
  );
}

// ─── New demos ───────────────────────────────────────────────────────────────

function DebounceDemo() {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 500);
  return (
    <DemoCard hookName="useDebounce" hint="Type fast — debounced value updates 500ms after you stop" code={
`const [input, setInput] = useState("")
const debounced = useDebounce(input, 500)`}>
      <input
        value={input} onChange={e => setInput(e.target.value)}
        placeholder="Type here…"
        style={{ width: "100%", padding: "10px 14px", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      />
      <div style={s.val}>Debounced: <strong>{debounced || <span style={{ color: "#94a3b8" }}>empty</span>}</strong></div>
    </DemoCard>
  );
}

function ThrottleDemo() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const throttled = useThrottle(pos, 200);
  return (
    <DemoCard hookName="useThrottle" hint="Move mouse over the box — throttled to 200ms" code={
`const [pos, setPos] = useState({ x: 0, y: 0 })
const throttled = useThrottle(pos, 200)`}>
      <div
        onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }); }}
        style={s.box({ cursor: "crosshair", background: "#f8fafc" })}
      >Move mouse here</div>
      <div style={s.val}>x: <strong>{throttled.x}</strong> · y: <strong>{throttled.y}</strong></div>
    </DemoCard>
  );
}

function IntervalDemo() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  useInterval(() => setCount(c => c + 1), running ? 1000 : null);
  return (
    <DemoCard hookName="useInterval" code={
`const [count, setCount] = useState(0)
useInterval(() => setCount(c => c + 1), 1000)`}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button style={s.btn({ background: running ? "#dc2626" : "#6366f1" })} onClick={() => setRunning(r => !r)}>
          {running ? <><Square size={13} /> Stop</> : <><Play size={13} /> Start</>}
        </button>
        <button style={s.btn({ background: "#64748b" })} onClick={() => setCount(0)}><RotateCcw size={13} /> Reset</button>
      </div>
      <div style={s.val}>Count: <strong>{count}</strong></div>
    </DemoCard>
  );
}

function TimeoutDemo() {
  const [fired, setFired] = useState(false);
  const { reset, clear } = useTimeout(() => setFired(true), 2000);
  return (
    <DemoCard hookName="useTimeout" hint="Fires after 2 seconds — reset to restart" code={
`const { reset, clear } = useTimeout(() => setFired(true), 2000)`}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button style={s.btn()} onClick={() => { setFired(false); reset(); }}><RotateCcw size={13} /> Reset</button>
        <button style={s.btn({ background: "#64748b" })} onClick={clear}>Clear</button>
      </div>
      <div style={{ ...s.val, background: fired ? "#f0fdf4" : "#f8fafc", border: `1px solid ${fired ? "#bbf7d0" : "#e8ecf0"}`, color: fired ? "#15803d" : "#64748b" }}>
        {fired ? <><Check size={13} /> Fired!</> : "Waiting…"}
      </div>
    </DemoCard>
  );
}

function AnimationFrameDemo() {
  const [angle, setAngle] = useState(0);
  const [running, setRunning] = useState(false);
  useAnimationFrame((dt) => {
    if (running) setAngle(a => (a + dt * 0.1) % 360);
  });
  return (
    <DemoCard hookName="useAnimationFrame" code={
`useAnimationFrame((deltaTime) => {
  setAngle(a => (a + deltaTime * 0.1) % 360)
})`}>
      <button style={s.btn({ background: running ? "#dc2626" : "#6366f1", marginBottom: "12px" })} onClick={() => setRunning(r => !r)}>
        {running ? <><Square size={13} /> Stop</> : <><Play size={13} /> Start</>}
      </button>
      <div style={s.box({ background: "#f0f9ff" })}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "conic-gradient(#6366f1, #a855f7, #6366f1)", transform: `rotate(${angle}deg)`, transition: "none" }} />
      </div>
    </DemoCard>
  );
}

function CountdownDemo() {
  const { count, running, start, stop, reset } = useCountdown(10);
  return (
    <DemoCard hookName="useCountdown" code={
`const { count, running, start, stop, reset } = useCountdown(10)`}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button style={s.btn({ background: running ? "#dc2626" : "#6366f1" })} onClick={running ? stop : start}>
          {running ? <><Square size={13} /> Stop</> : <><Play size={13} /> Start</>}
        </button>
        <button style={s.btn({ background: "#64748b" })} onClick={reset}><RotateCcw size={13} /> Reset</button>
      </div>
      <div style={{ ...s.val, fontSize: "28px", fontWeight: 700, textAlign: "center", color: count === 0 ? "#dc2626" : "#0f172a" }}>
        {count}s
      </div>
    </DemoCard>
  );
}

function MutationObserverDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [mutations, setMutations] = useState(0);
  const [items, setItems] = useState<string[]>(["Item 1"]);
  useMutationObserver(ref, () => setMutations(m => m + 1));
  return (
    <DemoCard hookName="useMutationObserver" hint="Click Add — observer fires on each DOM change" code={
`useMutationObserver(ref, (mutations) => {
  console.log(mutations)
})`}>
      <button style={s.btn({ marginBottom: "12px" })} onClick={() => setItems(i => [...i, `Item ${i.length + 1}`])}>
        Add item
      </button>
      <div ref={ref} style={{ ...s.val, minHeight: "60px" }}>
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </div>
      <div style={{ ...s.val, marginTop: "8px" }}>Mutations observed: <strong>{mutations}</strong></div>
    </DemoCard>
  );
}

function ElementSizeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);
  return (
    <DemoCard hookName="useElementSize" hint="Resize the browser window to see values update" code={
`const ref = useRef(null)
const { width, height } = useElementSize(ref)`}>
      <div ref={ref} style={s.box({ background: "#f0f9ff", borderColor: "#bae6fd", flexDirection: "column", gap: "4px" })}>
        <div style={{ fontWeight: 700, color: "#0ea5e9" }}>{Math.round(width)} × {Math.round(height)}</div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>px</div>
      </div>
    </DemoCard>
  );
}

function ElementPositionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { top, left } = useElementPosition(ref);
  return (
    <DemoCard hookName="useElementPosition" hint="Scroll the page — position updates in real time" code={
`const ref = useRef(null)
const { top, left, width, height } = useElementPosition(ref)`}>
      <div ref={ref} style={s.box({ background: "#faf5ff", borderColor: "#d8b4fe", flexDirection: "column", gap: "4px" })}>
        <div style={{ fontWeight: 700, color: "#7c3aed" }}>top: {Math.round(top)} · left: {Math.round(left)}</div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>viewport-relative px</div>
      </div>
    </DemoCard>
  );
}

function FullscreenDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle } = useFullscreen(ref);
  return (
    <DemoCard hookName="useFullscreen" code={
`const ref = useRef(null)
const { isFullscreen, enter, exit, toggle } = useFullscreen(ref)`}>
      <div ref={ref} style={s.box({ background: isFullscreen ? "#0f172a" : "#f8fafc", color: isFullscreen ? "#f1f5f9" : "#64748b", border: isFullscreen ? "none" : undefined, flexDirection: "column", gap: "8px" })}>
        <Maximize size={20} />
        <button style={s.btn({ background: isFullscreen ? "#dc2626" : "#6366f1" })} onClick={toggle}>
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>
      </div>
    </DemoCard>
  );
}

function WakeLockDemo() {
  const { supported, active, request, release } = useWakeLock();
  return (
    <DemoCard hookName="useWakeLock" hint="Prevents screen from sleeping (Chrome/Edge only)" code={
`const { supported, active, request, release } = useWakeLock()`}>
      {!supported
        ? <div style={s.val}>Not supported in this browser</div>
        : <button style={s.btn({ background: active ? "#dc2626" : "#6366f1" })} onClick={active ? release : request}>
            {active ? <><Zap size={13} /> Release Wake Lock</> : <><Zap size={13} /> Request Wake Lock</>}
          </button>
      }
      <div style={{ ...s.val, marginTop: "12px", background: active ? "#f0fdf4" : "#f8fafc", border: `1px solid ${active ? "#bbf7d0" : "#e8ecf0"}`, color: active ? "#15803d" : "#64748b" }}>
        {active ? "Screen will stay awake" : "Screen sleep allowed"}
      </div>
    </DemoCard>
  );
}

function PasteDemo() {
  const [pasted, setPasted] = useState<string | null>(null);
  usePaste((text) => setPasted(text));
  return (
    <DemoCard hookName="usePaste" hint="Copy some text then press Ctrl+V anywhere on the page" code={
`usePaste((text, event) => {
  console.log("Pasted:", text)
})`}>
      <div style={{ ...s.val, minHeight: "48px", color: pasted ? "#0f172a" : "#94a3b8" }}>
        {pasted ? `"${pasted.slice(0, 80)}${pasted.length > 80 ? "…" : ""}"` : "Paste something…"}
      </div>
    </DemoCard>
  );
}

function DoubleClickDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useDoubleClick(ref, () => setCount(c => c + 1));
  return (
    <DemoCard hookName="useDoubleClick" hint="Double-click the box (mouse only, distinct from touch doubleTap)" code={
`const ref = useRef(null)
useDoubleClick(ref, () => likePost())`}>
      <div ref={ref} style={s.box({ background: count > 0 ? "#fff7ed" : "#f8fafc", borderColor: count > 0 ? "#fed7aa" : "#cbd5e1", cursor: "pointer" })}>
        <MousePointerClick size={18} style={{ marginRight: "6px", color: count > 0 ? "#ea580c" : "#94a3b8" }} />
        Double-clicks: <strong style={{ marginLeft: "4px" }}>{count}</strong>
      </div>
    </DemoCard>
  );
}

function PointerLockDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { isLocked, lock, unlock } = usePointerLock(ref);
  return (
    <DemoCard hookName="usePointerLock" hint="Lock hides cursor and gives raw mouse movement (games/3D editors)" code={
`const ref = useRef(null)
const { isLocked, lock, unlock } = usePointerLock(ref)`}>
      <div ref={ref} style={s.box({ background: isLocked ? "#fef3c7" : "#f8fafc", borderColor: isLocked ? "#fcd34d" : "#cbd5e1", flexDirection: "column", gap: "8px" })}>
        <div style={{ fontSize: "13px", color: "#64748b" }}>{isLocked ? "Pointer locked — press Esc to release" : "Click to lock pointer"}</div>
        <button style={s.btn({ background: isLocked ? "#dc2626" : "#6366f1" })} onClick={isLocked ? unlock : lock}>
          {isLocked ? <><LockOpen size={13} /> Unlock</> : <><Lock size={13} /> Lock Pointer</>}
        </button>
      </div>
    </DemoCard>
  );
}

function KeySequenceDemo() {
  const [hit, setHit] = useState(false);
  useKeySequence(["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"], () => { setHit(true); setTimeout(() => setHit(false), 2000); });
  return (
    <DemoCard hookName="useKeySequence" hint="Try: ↑ ↑ ↓ ↓ ← → ← →" code={
`useKeySequence(
  ["ArrowUp","ArrowUp","ArrowDown","ArrowDown",
   "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"],
  () => activateCheats()
)`}>
      <div style={{ ...s.val, textAlign: "center", background: hit ? "#f0fdf4" : "#f8fafc", border: `1px solid ${hit ? "#bbf7d0" : "#e8ecf0"}`, color: hit ? "#15803d" : "#64748b" }}>
        {hit ? <><Check size={14} /> Konami code activated!</> : "↑ ↑ ↓ ↓ ← → ← →"}
      </div>
    </DemoCard>
  );
}

function ScrollIntoViewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollIntoView(ref, { behavior: "smooth", block: "center" });
  return (
    <DemoCard hookName="useScrollIntoView" code={
`const ref = useRef(null)
const scrollTo = useScrollIntoView(ref, { behavior: "smooth" })
// ...
<button onClick={scrollTo}>Scroll to element</button>`}>
      <div ref={ref} style={s.box({ background: "#f0fdf4", borderColor: "#86efac", borderStyle: "solid" })}>
        Target element
      </div>
      <button style={s.btn({ marginTop: "12px" })} onClick={scrollTo}>Scroll to target</button>
    </DemoCard>
  );
}

function ScrollSpyDemo() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const refs = [ref1, ref2, ref3];
  const labels = ["Section A", "Section B", "Section C"];
  const active = useScrollSpy(refs, { threshold: 0.8 });
  return (
    <DemoCard hookName="useScrollSpy" hint="Scroll inside the box" code={
`const active = useScrollSpy([ref1, ref2, ref3], { threshold: 0.5 })`}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        {labels.map((l, i) => (
          <span key={i} style={{ ...s.chip(active === i), fontSize: "12px" }}>{l}</span>
        ))}
      </div>
      <div style={{ height: "120px", overflowY: "auto", border: "1.5px dashed #cbd5e1", borderRadius: "10px" }}>
        {refs.map((r, i) => (
          <div key={i} ref={r} style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: active === i ? "#6366f1" : "#94a3b8", fontWeight: active === i ? 700 : 400, borderBottom: "1px solid #f1f5f9" }}>
            {labels[i]}
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

function InfiniteScrollDemo() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`));
  const { loading } = useInfiniteScroll(sentinelRef, async () => {
    await new Promise(r => setTimeout(r, 600));
    setItems(prev => [...prev, ...Array.from({ length: 3 }, (_, i) => `Item ${prev.length + i + 1}`)]);
  });
  return (
    <DemoCard hookName="useInfiniteScroll" hint="Scroll to bottom to load more" code={
`const { loading } = useInfiniteScroll(ref, async () => {
  const more = await fetchNextPage()
  setItems(prev => [...prev, ...more])
})`}>
      <div style={{ height: "160px", overflowY: "auto", border: "1.5px dashed #cbd5e1", borderRadius: "10px", padding: "8px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "8px 12px", borderRadius: "7px", marginBottom: "4px", background: "#f8fafc", fontSize: "13px", color: "#475569" }}>{item}</div>
        ))}
        <div ref={sentinelRef} style={{ padding: "8px", textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>
          {loading ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite", display: "inline" }} /> Loading…</> : "Scroll for more"}
        </div>
      </div>
    </DemoCard>
  );
}

function ShareDemo() {
  const { supported, share } = useShare();
  const [result, setResult] = useState<string | null>(null);
  return (
    <DemoCard hookName="useShare" hint="Native share dialog (mobile/supported browsers only)" code={
`const { supported, share } = useShare()
await share({ title: "Hello", url: window.location.href })`}>
      {!supported
        ? <div style={s.val}>Web Share API not supported in this browser</div>
        : <button style={s.btn()} onClick={async () => {
            try { await share({ title: "hookset", url: "https://271043.github.io/hookset/" }); setResult("Shared!"); }
            catch { setResult("Cancelled"); }
          }}><Share2 size={13} /> Share</button>
      }
      {result && <div style={{ ...s.val, marginTop: "10px" }}>{result}</div>}
    </DemoCard>
  );
}

function PermissionDemo() {
  const camera = usePermission("camera" as PermissionName);
  const notifications = usePermission("notifications" as PermissionName);
  return (
    <DemoCard hookName="usePermission" code={
`const state = usePermission("camera")
// "granted" | "denied" | "prompt" | null`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={s.val}>camera: <strong style={{ color: camera === "granted" ? "#15803d" : camera === "denied" ? "#b91c1c" : "#92400e" }}>{camera ?? "…"}</strong></div>
        <div style={s.val}>notifications: <strong style={{ color: notifications === "granted" ? "#15803d" : notifications === "denied" ? "#b91c1c" : "#92400e" }}>{notifications ?? "…"}</strong></div>
      </div>
    </DemoCard>
  );
}

function NotificationDemo() {
  const { permission, requestPermission, notify, supported } = useNotification();
  return (
    <DemoCard hookName="useNotification" code={
`const { permission, requestPermission, notify } = useNotification()
await requestPermission()
notify("Hello!", { body: "World" })`}>
      {!supported
        ? <div style={s.val}>Notifications not supported</div>
        : <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button style={s.btn()} onClick={requestPermission}>
                <Bell size={13} /> Request Permission
              </button>
              <button style={s.btn({ background: permission === "granted" ? "#15803d" : "#94a3b8" })}
                onClick={() => notify("hookset", { body: "Hello from useNotification!" })}
                disabled={permission !== "granted"}>
                Send
              </button>
            </div>
            <div style={s.val}>permission: <strong>{permission}</strong></div>
          </>
      }
    </DemoCard>
  );
}

function ReducedMotionDemo() {
  const reduced = useReducedMotion();
  return (
    <DemoCard hookName="useReducedMotion" hint="Toggle 'Reduce motion' in OS accessibility settings" code={
`const reduced = useReducedMotion()
// true when user prefers reduced motion`}>
      <div style={s.box({ background: "#f8fafc", flexDirection: "column", gap: "10px" })}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", animation: reduced ? "none" : "spin 1s linear infinite" }} />
        <span style={{ fontSize: "13px", color: "#64748b" }}>{reduced ? "Animation disabled (reduced motion)" : "Animation running"}</span>
      </div>
    </DemoCard>
  );
}

function ColorSchemeDemo() {
  const scheme = useColorScheme();
  return (
    <DemoCard hookName="useColorScheme" hint="Change OS dark/light mode preference" code={
`const scheme = useColorScheme() // "dark" | "light"`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "8px", background: scheme === "dark" ? "#0f172a" : "#f8fafc", color: scheme === "dark" ? "#f1f5f9" : "#0f172a", border: `1px solid ${scheme === "dark" ? "#334155" : "#e2e8f0"}` }}>
        {scheme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
        {scheme === "dark" ? "Dark mode" : "Light mode"}
      </div>
    </DemoCard>
  );
}

function GamepadDemo() {
  const { gamepads, connected } = useGamepad();
  return (
    <DemoCard hookName="useGamepad" hint="Connect a gamepad and press any button" code={
`const { gamepads, connected } = useGamepad()`}>
      <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "8px", background: connected ? "#f0fdf4" : "#f8fafc", border: `1px solid ${connected ? "#bbf7d0" : "#e8ecf0"}`, color: connected ? "#15803d" : "#94a3b8" }}>
        <Gamepad2 size={14} />
        {connected ? `${gamepads.length} gamepad connected` : "No gamepad detected"}
      </div>
    </DemoCard>
  );
}

function SpeechRecognitionDemo() {
  const { supported, listening, transcript, start, stop, reset } = useSpeechRecognition();
  return (
    <DemoCard hookName="useSpeechRecognition" hint="Chrome/Edge only" code={
`const { listening, transcript, start, stop } = useSpeechRecognition()`}>
      {!supported
        ? <div style={s.val}>Not supported in this browser</div>
        : <>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button style={s.btn({ background: listening ? "#dc2626" : "#6366f1" })} onClick={listening ? stop : start}>
                {listening ? <><MicOff size={13} /> Stop</> : <><Mic size={13} /> Start</>}
              </button>
              <button style={s.btn({ background: "#64748b" })} onClick={reset}><RotateCcw size={13} /></button>
            </div>
            <div style={s.val}>{transcript || <span style={{ color: "#94a3b8" }}>Start speaking…</span>}</div>
          </>
      }
    </DemoCard>
  );
}

function SpeechSynthesisDemo() {
  const { supported, speaking, speak, cancel } = useSpeechSynthesis();
  const [text, setText] = useState("Hello from hookset!");
  return (
    <DemoCard hookName="useSpeechSynthesis" code={
`const { speak, speaking, cancel } = useSpeechSynthesis()
speak("Hello world", { rate: 1, pitch: 1 })`}>
      {!supported
        ? <div style={s.val}>Not supported in this browser</div>
        : <>
            <input value={text} onChange={e => setText(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "13px", outline: "none", boxSizing: "border-box", marginBottom: "10px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={s.btn()} onClick={() => speak(text)} disabled={speaking}>
                <Volume2 size={13} /> Speak
              </button>
              <button style={s.btn({ background: "#64748b" })} onClick={cancel} disabled={!speaking}>Stop</button>
            </div>
          </>
      }
    </DemoCard>
  );
}

function EyeDropperDemo() {
  const { supported, color, open } = useEyeDropper();
  return (
    <DemoCard hookName="useEyeDropper" hint="Chrome 95+ only" code={
`const { supported, color, open } = useEyeDropper()
const hex = await open()`}>
      {!supported
        ? <div style={s.val}>EyeDropper API not supported in this browser</div>
        : <>
            <button style={s.btn({ marginBottom: "12px" })} onClick={open}>
              <Pipette size={13} /> Pick Color
            </button>
            <div style={{ ...s.val, display: "flex", alignItems: "center", gap: "10px" }}>
              {color && <div style={{ width: 28, height: 28, borderRadius: "6px", background: color, border: "2px solid #e2e8f0", flexShrink: 0 }} />}
              <span>{color ?? <span style={{ color: "#94a3b8" }}>no color picked</span>}</span>
            </div>
          </>
      }
    </DemoCard>
  );
}

function FocusReturnDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoCard hookName="useFocusReturn" hint="Focus the button, open modal, close — focus returns" code={
`function Modal({ onClose }) {
  useFocusReturn() // restores focus on unmount
  return <dialog>...</dialog>
}`}>
      <button style={s.btn({ marginBottom: "12px" })} onClick={() => setOpen(true)}>Open Modal</button>
      {open && <FocusReturnModal onClose={() => setOpen(false)} />}
    </DemoCard>
  );
}

function FocusReturnModal({ onClose }: { onClose: () => void }) {
  useFocusReturn();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", minWidth: "280px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontWeight: 600, marginBottom: "12px" }}>Modal</div>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Focus will return to the trigger button when closed.</p>
        <button style={s.btn()} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function TabFocusDemo() {
  const isTabFocused = useTabFocus();
  return (
    <DemoCard hookName="useTabFocus" hint="Navigate with Tab key vs clicking — style changes" code={
`const isTabFocused = useTabFocus()
// true when user navigates with keyboard`}>
      <div style={s.val}>Navigation mode: <strong style={{ color: isTabFocused ? "#6366f1" : "#64748b" }}>{isTabFocused ? "Keyboard (Tab)" : "Mouse/Touch"}</strong></div>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        {["Button A", "Button B", "Button C"].map(label => (
          <button key={label} style={{ padding: "8px 14px", borderRadius: "8px", border: `2px solid ${isTabFocused ? "#6366f1" : "#e2e8f0"}`, background: "#f8fafc", cursor: "pointer", fontSize: "13px" }}>{label}</button>
        ))}
      </div>
    </DemoCard>
  );
}

function ContainerQueryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const matches = useContainerQuery(ref, { sm: 300, md: 450, lg: 600 });
  return (
    <DemoCard hookName="useContainerQuery" hint="Resize browser window to see breakpoints change" code={
`const matches = useContainerQuery(ref, {
  sm: 300, md: 450, lg: 600
})`}>
      <div ref={ref} style={{ border: "1.5px dashed #cbd5e1", borderRadius: "12px", padding: "16px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {Object.entries(matches).map(([key, active]) => (
            <span key={key} style={{ ...s.chip(active), fontSize: "12px" }}>{key}: {active ? "✓" : "✗"}</span>
          ))}
        </div>
      </div>
    </DemoCard>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const sections: Array<{ id: string; label: string; Icon: LucideIcon; demos: ReactNode[] }> = [
  { id: "pointer", label: "Pointer & Mouse", Icon: Mouse,
    demos: [<OutsideClickDemo />, <HoverDemo />, <DragDemo />, <PointerPositionDemo />, <ContextMenuDemo />, <MouseLeaveWindowDemo />, <DoubleClickDemo />, <PointerLockDemo />] },
  { id: "touch", label: "Touch", Icon: Hand,
    demos: [<SwipeDemo />, <DoubleTapDemo />, <PinchDemo />, <LongPressDemo />] },
  { id: "keyboard", label: "Keyboard", Icon: Keyboard,
    demos: [<KeyPressDemo />, <KeyComboDemo />, <ArrowNavDemo />, <FocusTrapDemo />, <KeySequenceDemo />] },
  { id: "focus", label: "Focus & Visibility", Icon: Eye,
    demos: [<FocusWithinDemo />, <IntersectionDemo />, <IdleDemo />, <PageVisibilityDemo />, <FocusReturnDemo />, <TabFocusDemo />] },
  { id: "scroll", label: "Scroll", Icon: ScrollText,
    demos: [<ScrollPositionDemo />, <ScrollDirectionDemo />, <ScrollProgressDemo />, <ScrollLockDemo />, <ScrollIntoViewDemo />, <ScrollSpyDemo />, <InfiniteScrollDemo />] },
  { id: "resize", label: "Resize & DOM", Icon: Maximize2,
    demos: [<ResizeObserverDemo />, <WindowSizeDemo />, <ElementSizeDemo />, <ElementPositionDemo />, <ContainerQueryDemo />, <MutationObserverDemo />, <FullscreenDemo />] },
  { id: "media", label: "Clipboard & Media", Icon: Clipboard,
    demos: [<CopyDemo />, <MediaQueryDemo />, <TextSelectionDemo />, <DropZoneDemo />, <PasteDemo />, <ShareDemo />, <PermissionDemo />, <NotificationDemo />, <ReducedMotionDemo />, <ColorSchemeDemo />] },
  { id: "device", label: "Device & Sensors", Icon: Cpu,
    demos: [<DeviceOrientationDemo />, <GeolocationDemo />, <NetworkStatusDemo />, <BatteryDemo />, <VibrateDemo />, <WakeLockDemo />, <GamepadDemo />, <SpeechRecognitionDemo />, <SpeechSynthesisDemo />, <EyeDropperDemo />] },
  { id: "timing", label: "Timing", Icon: Timer,
    demos: [<DebounceDemo />, <ThrottleDemo />, <IntervalDemo />, <TimeoutDemo />, <AnimationFrameDemo />, <CountdownDemo />] },
];

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("pointer");
  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ScrollProgressBar />

      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerTitle}>hookset</span>
          <span style={s.headerSub}>65 hooks · zero dependencies · tree-shakeable</span>
        </div>
        <a
          href="https://www.npmjs.com/package/hookset"
          target="_blank" rel="noreferrer"
          style={s.headerBadge}
        >
          npm ↗
        </a>
      </header>

      <div style={s.layout}>
        <nav style={s.sidebar}>
          <div style={s.sidebarLabel}>Hooks</div>
          {sections.map((sec) => (
            <button key={sec.id} style={s.navItem(active === sec.id)} onClick={() => {
              setActive(sec.id);
              document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
            }}>
              <sec.Icon size={14} strokeWidth={active === sec.id ? 2.5 : 2} />
              <span style={{ flex: 1 }}>{sec.label}</span>
              <span style={s.navCount(active === sec.id)}>{sec.demos.length}</span>
            </button>
          ))}
        </nav>

        <main style={s.content}>
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} style={s.section}>
              <div style={s.sectionTitle}>
                <sec.Icon size={16} color="#6366f1" strokeWidth={2.5} />
                {sec.label}
                <span style={s.sectionCount}>{sec.demos.length} hooks</span>
              </div>
              <div style={s.grid}>
                {sec.demos.map((demo, i) => <div key={i}>{demo}</div>)}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

function ScrollProgressBar() {
  const p = useScrollProgress();
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 200, background: "transparent" }}>
      <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)", width: `${p * 100}%`, transition: "width 0.05s" }} />
    </div>
  );
}
