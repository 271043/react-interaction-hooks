import { useRef, useState, CSSProperties } from "react";
import {
  useOutsideClick, useScrollLock, useHover, useKeyCombo, useLongPress,
  useDrag, useSwipe, useDoubleTap, usePinch, usePointerPosition,
  useKeyPress, useFocusTrap, useArrowNavigation, useFocusWithin,
  useIntersectionObserver, useIdle, useCopyToClipboard, useMediaQuery,
  useScrollPosition, useScrollDirection, useScrollProgress,
  useResizeObserver, useWindowSize, useDropZone, useContextMenu,
  useMouseLeaveWindow, useDeviceOrientation, useGeolocation,
  useNetworkStatus, useBattery, useVibrate, usePageVisibility, useTextSelection,
} from "@sharpbits/react-interaction-hooks";

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  page: { background: "#f8fafc", minHeight: "100vh", color: "#1e293b" } as CSSProperties,
  header: {
    background: "#0f172a", color: "#f1f5f9", padding: "14px 28px",
    display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 100,
  } as CSSProperties,
  headerTitle: { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" } as CSSProperties,
  headerSub: { fontSize: "13px", color: "#94a3b8" } as CSSProperties,
  layout: { display: "grid", gridTemplateColumns: "200px 1fr" } as CSSProperties,
  sidebar: {
    background: "#fff", borderRight: "1px solid #e2e8f0",
    padding: "16px 0", position: "sticky", top: "49px",
    height: "calc(100vh - 49px)", overflowY: "auto",
  } as CSSProperties,
  navItem: (active: boolean): CSSProperties => ({
    display: "block", padding: "7px 18px", cursor: "pointer", fontSize: "13px",
    color: active ? "#6366f1" : "#64748b", fontWeight: active ? 600 : 400,
    background: active ? "#eef2ff" : "transparent",
    borderLeft: `3px solid ${active ? "#6366f1" : "transparent"}`,
    border: "none", width: "100%", textAlign: "left",
  }),
  content: { padding: "28px 32px", maxWidth: "980px" } as CSSProperties,
  section: { marginBottom: "48px", scrollMarginTop: "64px" } as CSSProperties,
  sectionTitle: {
    fontSize: "17px", fontWeight: 700, marginBottom: "16px",
    paddingBottom: "10px", borderBottom: "2px solid #e2e8f0",
  } as CSSProperties,
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "12px" } as CSSProperties,
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" } as CSSProperties,
  hookName: { fontSize: "12px", fontWeight: 700, color: "#6366f1", marginBottom: "10px", fontFamily: "monospace" } as CSSProperties,
  val: { fontSize: "13px", fontFamily: "monospace", background: "#f1f5f9", padding: "6px 10px", borderRadius: "6px", marginTop: "10px", wordBreak: "break-all" } as CSSProperties,
  hint: { fontSize: "11px", color: "#94a3b8", marginBottom: "6px" } as CSSProperties,
  box: (extra?: CSSProperties): CSSProperties => ({
    height: "80px", borderRadius: "8px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "13px", border: "2px dashed #cbd5e1",
    cursor: "pointer", userSelect: "none", transition: "all 0.2s", ...extra,
  }),
  btn: (extra?: CSSProperties): CSSProperties => ({
    padding: "7px 14px", borderRadius: "6px", border: "none",
    background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600, ...extra,
  }),
  chip: (on: boolean): CSSProperties => ({
    display: "inline-flex", alignItems: "center", padding: "3px 10px",
    borderRadius: "999px", fontSize: "12px", fontWeight: 600,
    background: on ? "#dcfce7" : "#f1f5f9", color: on ? "#16a34a" : "#64748b",
  }),
};

// ─── Demo cards ──────────────────────────────────────────────────────────────

function OutsideClickDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useOutsideClick(ref, () => setN((c) => c + 1));
  return (
    <div style={s.card}>
      <div style={s.hookName}>useOutsideClick</div>
      <div ref={ref} style={s.box({ background: "#f0f9ff" })}>Click outside me</div>
      <div style={s.val}>Outside clicks: {n}</div>
    </div>
  );
}

function ScrollLockDemo() {
  const [locked, setLocked] = useState(false);
  useScrollLock(locked);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useScrollLock</div>
      <button style={s.btn({ background: locked ? "#ef4444" : "#6366f1" })} onClick={() => setLocked((l) => !l)}>
        {locked ? "🔒 Unlock Scroll" : "🔓 Lock Scroll"}
      </button>
    </div>
  );
}

function HoverDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const hovered = useHover(ref);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useHover</div>
      <div ref={ref} style={s.box({ background: hovered ? "#dcfce7" : "#f8fafc", borderColor: hovered ? "#22c55e" : "#cbd5e1" })}>
        {hovered ? "✅ Hovering" : "Hover me"}
      </div>
    </div>
  );
}

function KeyComboDemo() {
  const [last, setLast] = useState("—");
  useKeyCombo("ctrl+k", () => setLast("Ctrl+K"));
  useKeyCombo("ctrl+shift+p", () => setLast("Ctrl+Shift+P"));
  useKeyCombo("alt+s", () => setLast("Alt+S"));
  return (
    <div style={s.card}>
      <div style={s.hookName}>useKeyCombo</div>
      <div style={s.hint}>Try: Ctrl+K · Ctrl+Shift+P · Alt+S</div>
      <div style={s.val}>Last: {last}</div>
    </div>
  );
}

function LongPressDemo() {
  const ref = useRef<HTMLButtonElement>(null);
  const [msg, setMsg] = useState("Hold me (600ms)");
  useLongPress(ref, () => setMsg("🎉 Long pressed!"), {
    threshold: 600,
    onStart: () => setMsg("Holding…"),
    onCancel: () => setMsg("Hold me (600ms)"),
  });
  return (
    <div style={s.card}>
      <div style={s.hookName}>useLongPress</div>
      <button ref={ref} style={s.btn({ width: "100%", padding: "14px" })}>{msg}</button>
    </div>
  );
}

function DragDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { isDragging, delta, position } = useDrag(ref);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useDrag</div>
      <div ref={ref} style={s.box({ background: isDragging ? "#fef3c7" : "#f8fafc", cursor: isDragging ? "grabbing" : "grab" })}>
        {isDragging ? "🤏 Dragging" : "↔ Drag me"}
      </div>
      <div style={s.val}>Δ {delta.x.toFixed(0)}, {delta.y.toFixed(0)} — pos {position.x.toFixed(0)}, {position.y.toFixed(0)}</div>
    </div>
  );
}

function SwipeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [dir, setDir] = useState("—");
  useSwipe(ref, { onSwipe: setDir });
  return (
    <div style={s.card}>
      <div style={s.hookName}>useSwipe</div>
      <div style={s.hint}>Touch device: swipe inside the box</div>
      <div ref={ref} style={s.box({ background: "#f0f9ff", height: "90px", touchAction: "none" })}>Swipe here</div>
      <div style={s.val}>Direction: {dir}</div>
    </div>
  );
}

function DoubleTapDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useDoubleTap(ref, () => setN((c) => c + 1));
  return (
    <div style={s.card}>
      <div style={s.hookName}>useDoubleTap</div>
      <div style={s.hint}>Touch device: double-tap the box</div>
      <div ref={ref} style={s.box({ background: "#fdf4ff" })}>Double-tap here</div>
      <div style={s.val}>Double taps: {n}</div>
    </div>
  );
}

function PinchDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  usePinch(ref, { onPinch: ({ scale: sc }) => setScale(sc), onPinchEnd: () => setScale(1) });
  return (
    <div style={s.card}>
      <div style={s.hookName}>usePinch</div>
      <div style={s.hint}>Touch device: pinch inside the box</div>
      <div ref={ref} style={s.box({ background: "#fff7ed", height: "90px", touchAction: "none" })}>
        <span style={{ transform: `scale(${scale})`, display: "inline-block", transition: "transform 0.05s", fontSize: "24px" }}>📦</span>
      </div>
      <div style={s.val}>Scale: {scale.toFixed(2)}×</div>
    </div>
  );
}

function PointerPositionDemo() {
  const { clientX, clientY } = usePointerPosition();
  return (
    <div style={s.card}>
      <div style={s.hookName}>usePointerPosition</div>
      <div style={s.hint}>Move mouse anywhere on the page</div>
      <div style={s.val}>x: {clientX} · y: {clientY}</div>
    </div>
  );
}

function KeyPressDemo() {
  const shift = useKeyPress("Shift");
  const ctrl = useKeyPress("Control");
  const alt = useKeyPress("Alt");
  const meta = useKeyPress("Meta");
  return (
    <div style={s.card}>
      <div style={s.hookName}>useKeyPress</div>
      <div style={s.hint}>Hold modifier keys</div>
      <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
        {([["Shift", shift], ["Ctrl", ctrl], ["Alt", alt], ["Meta", meta]] as [string, boolean][]).map(([k, v]) => (
          <span key={k} style={s.chip(v)}>{k}</span>
        ))}
      </div>
    </div>
  );
}

function FocusTrapDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useFocusTrap(ref, open);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useFocusTrap</div>
      <button style={s.btn()} onClick={() => setOpen(true)}>Open modal</button>
      {open && (
        <div ref={ref} style={{ marginTop: "12px", padding: "14px", background: "#f0f9ff", borderRadius: "8px", border: "2px solid #0ea5e9" }}>
          <div style={{ marginBottom: "8px", fontWeight: 600, fontSize: "13px" }}>Tab is trapped inside ↩</div>
          <input style={{ padding: "5px 8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }} placeholder="Input 1" />
          <input style={{ padding: "5px 8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }} placeholder="Input 2" />
          <button style={s.btn({ background: "#ef4444", marginTop: "8px" })} onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

function ArrowNavDemo() {
  const ref = useRef<HTMLUListElement>(null);
  useArrowNavigation(ref);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useArrowNavigation</div>
      <div style={s.hint}>Click an item then use ↑↓</div>
      <ul ref={ref} style={{ listStyle: "none", marginTop: "6px" }}>
        {["Apple 🍎", "Banana 🍌", "Cherry 🍒", "Durian 🌵"].map((item) => (
          <li key={item} tabIndex={0}
            style={{ padding: "6px 10px", borderRadius: "6px", marginBottom: "4px", cursor: "pointer", outline: "none", fontSize: "13px", transition: "background 0.1s" }}
            onFocus={(e) => (e.currentTarget.style.background = "#e0f2fe")}
            onBlur={(e) => (e.currentTarget.style.background = "transparent")}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FocusWithinDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const within = useFocusWithin(ref);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useFocusWithin</div>
      <div ref={ref} style={{ padding: "10px", border: `2px solid ${within ? "#22c55e" : "#cbd5e1"}`, borderRadius: "8px", transition: "border-color 0.2s" }}>
        <input style={{ padding: "5px 8px", width: "100%", borderRadius: "4px", border: "1px solid #e2e8f0", outline: "none" }} placeholder="Focus inside me" />
      </div>
      <div style={s.val}>Focus within: {within ? "✅ Yes" : "❌ No"}</div>
    </div>
  );
}

function IntersectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { isIntersecting, ratio } = useIntersectionObserver(ref, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  return (
    <div style={s.card}>
      <div style={s.hookName}>useIntersectionObserver</div>
      <div style={s.hint}>Scroll the page</div>
      <div ref={ref} style={s.box({ background: isIntersecting ? "#dcfce7" : "#fee2e2", borderColor: isIntersecting ? "#22c55e" : "#ef4444" })}>
        {isIntersecting ? "👁 In viewport" : "🙈 Out of viewport"}
      </div>
      <div style={s.val}>Ratio: {(ratio * 100).toFixed(0)}%</div>
    </div>
  );
}

function IdleDemo() {
  const idle = useIdle(3000);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useIdle</div>
      <div style={s.hint}>Stop all input for 3 seconds</div>
      <div style={{ ...s.val, background: idle ? "#fef3c7" : "#dcfce7", color: idle ? "#92400e" : "#166534" }}>
        {idle ? "💤 Idle" : "🟢 Active"}
      </div>
    </div>
  );
}

function CopyDemo() {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useCopyToClipboard</div>
      <button style={s.btn({ background: copied ? "#22c55e" : "#6366f1" })} onClick={() => copy("Hello from react-interaction-hooks! 🎉")}>
        {copied ? "✅ Copied!" : "📋 Copy to clipboard"}
      </button>
    </div>
  );
}

function MediaQueryDemo() {
  const dark = useMediaQuery("(prefers-color-scheme: dark)");
  const mobile = useMediaQuery("(max-width: 768px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return (
    <div style={s.card}>
      <div style={s.hookName}>useMediaQuery</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
        <span style={s.chip(dark)}>{dark ? "🌙 Dark" : "☀️ Light"}</span>
        <span style={s.chip(mobile)}>{mobile ? "📱 Mobile" : "🖥 Desktop"}</span>
        <span style={s.chip(reduced)}>{reduced ? "🐢 Reduced motion" : "✨ Motion ok"}</span>
      </div>
    </div>
  );
}

function ScrollPositionDemo() {
  const { x, y } = useScrollPosition();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useScrollPosition</div>
      <div style={s.hint}>Scroll the page</div>
      <div style={s.val}>x: {x.toFixed(0)} · y: {y.toFixed(0)}</div>
    </div>
  );
}

function ScrollDirectionDemo() {
  const dir = useScrollDirection();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useScrollDirection</div>
      <div style={s.hint}>Scroll the page</div>
      <div style={s.val}>{dir === "down" ? "⬇ Down" : dir === "up" ? "⬆ Up" : "— Not scrolled yet"}</div>
    </div>
  );
}

function ScrollProgressDemo() {
  const p = useScrollProgress();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useScrollProgress</div>
      <div style={s.hint}>Scroll the page</div>
      <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", marginTop: "8px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#6366f1", width: `${p * 100}%`, transition: "width 0.1s", borderRadius: "4px" }} />
      </div>
      <div style={s.val}>{(p * 100).toFixed(1)}%</div>
    </div>
  );
}

function ResizeObserverDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(ref);
  return (
    <div style={s.card}>
      <div style={s.hookName}>useResizeObserver</div>
      <div ref={ref} style={{ resize: "both", overflow: "auto", border: "2px dashed #cbd5e1", borderRadius: "8px", padding: "12px", minHeight: "70px", minWidth: "120px", fontSize: "13px", color: "#64748b" }}>
        ↘ Drag corner to resize
      </div>
      <div style={s.val}>{width.toFixed(0)} × {height.toFixed(0)} px</div>
    </div>
  );
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useWindowSize</div>
      <div style={s.hint}>Resize the browser window</div>
      <div style={s.val}>{width} × {height} px</div>
    </div>
  );
}

function DropZoneDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const { isOver } = useDropZone(ref, { onDrop: (fl) => setFiles(Array.from(fl).map((f) => f.name)) });
  return (
    <div style={s.card}>
      <div style={s.hookName}>useDropZone</div>
      <div ref={ref} style={s.box({ height: "90px", background: isOver ? "#e0f2fe" : "#f8fafc", borderColor: isOver ? "#0ea5e9" : "#cbd5e1" })}>
        {isOver ? "📂 Drop!" : "📁 Drop files here"}
      </div>
      {files.length > 0 && <div style={s.val}>{files.join(", ")}</div>}
    </div>
  );
}

function ContextMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useContextMenu(ref, (e) => setPos({ x: e.clientX, y: e.clientY }));
  return (
    <div style={s.card}>
      <div style={s.hookName}>useContextMenu</div>
      <div ref={ref} style={s.box({ background: "#fdf4ff" })}>Right-click me</div>
      <div style={s.val}>{pos ? `x: ${pos.x} · y: ${pos.y}` : "—"}</div>
    </div>
  );
}

function MouseLeaveWindowDemo() {
  const [n, setN] = useState(0);
  useMouseLeaveWindow(() => setN((c) => c + 1));
  return (
    <div style={s.card}>
      <div style={s.hookName}>useMouseLeaveWindow</div>
      <div style={s.hint}>Move mouse outside the browser window</div>
      <div style={s.val}>Left window: {n}×</div>
    </div>
  );
}

function DeviceOrientationDemo() {
  const { alpha, beta, gamma } = useDeviceOrientation();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useDeviceOrientation</div>
      <div style={s.hint}>Tilt your device (mobile/tablet only)</div>
      <div style={s.val}>α: {alpha?.toFixed(1) ?? "—"} · β: {beta?.toFixed(1) ?? "—"} · γ: {gamma?.toFixed(1) ?? "—"}</div>
    </div>
  );
}

function GeolocationDemo() {
  const { loading, position, error } = useGeolocation();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useGeolocation</div>
      <div style={s.val}>
        {loading ? "⏳ Requesting location…"
          : error ? `❌ ${error.message}`
          : `${position?.coords.latitude.toFixed(5)}, ${position?.coords.longitude.toFixed(5)}`}
      </div>
    </div>
  );
}

function NetworkStatusDemo() {
  const { online, effectiveType } = useNetworkStatus();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useNetworkStatus</div>
      <div style={{ ...s.val, background: online ? "#dcfce7" : "#fee2e2", color: online ? "#166534" : "#991b1b" }}>
        {online ? "🟢 Online" : "🔴 Offline"}{effectiveType ? ` · ${effectiveType}` : ""}
      </div>
    </div>
  );
}

function BatteryDemo() {
  const { supported, loading, level, charging, dischargingTime } = useBattery();
  const pct = level !== null ? `${(level * 100).toFixed(0)}%` : "—";
  const mins = dischargingTime && isFinite(dischargingTime) ? `${Math.round(dischargingTime / 60)}m left` : "";
  return (
    <div style={s.card}>
      <div style={s.hookName}>useBattery</div>
      <div style={s.val}>
        {!supported ? "Not supported in this browser"
          : loading ? "⏳ Loading…"
          : `${charging ? "⚡ Charging" : "🔋"} ${pct} ${mins}`}
      </div>
    </div>
  );
}

function VibrateDemo() {
  const vibrate = useVibrate();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useVibrate</div>
      <div style={s.hint}>Mobile only</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button style={s.btn()} onClick={() => vibrate(200)}>Short buzz</button>
        <button style={s.btn()} onClick={() => vibrate([100, 80, 100, 80, 300])}>Pattern</button>
        <button style={s.btn({ background: "#ef4444" })} onClick={() => vibrate(0)}>Stop</button>
      </div>
    </div>
  );
}

function PageVisibilityDemo() {
  const visible = usePageVisibility();
  return (
    <div style={s.card}>
      <div style={s.hookName}>usePageVisibility</div>
      <div style={s.hint}>Switch browser tabs then come back</div>
      <div style={{ ...s.val, background: visible ? "#dcfce7" : "#fee2e2", color: visible ? "#166534" : "#991b1b" }}>
        {visible ? "👁 Page visible" : "🙈 Page hidden"}
      </div>
    </div>
  );
}

function TextSelectionDemo() {
  const { text } = useTextSelection();
  return (
    <div style={s.card}>
      <div style={s.hookName}>useTextSelection</div>
      <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#475569", margin: "4px 0 8px" }}>
        Select any text anywhere on this page.
      </p>
      <div style={s.val}>{text ? `"${text.length > 50 ? text.slice(0, 50) + "…" : text}"` : "—"}</div>
    </div>
  );
}

// ─── Sections config ─────────────────────────────────────────────────────────

const sections = [
  {
    id: "pointer",
    label: "🖱 Pointer & Mouse",
    demos: [<OutsideClickDemo />, <HoverDemo />, <DragDemo />, <PointerPositionDemo />, <ContextMenuDemo />, <MouseLeaveWindowDemo />],
  },
  {
    id: "touch",
    label: "👆 Touch",
    demos: [<SwipeDemo />, <DoubleTapDemo />, <PinchDemo />, <LongPressDemo />],
  },
  {
    id: "keyboard",
    label: "⌨️ Keyboard",
    demos: [<KeyPressDemo />, <KeyComboDemo />, <ArrowNavDemo />, <FocusTrapDemo />],
  },
  {
    id: "focus",
    label: "🎯 Focus & Visibility",
    demos: [<FocusWithinDemo />, <IntersectionDemo />, <IdleDemo />, <PageVisibilityDemo />],
  },
  {
    id: "scroll",
    label: "📜 Scroll",
    demos: [<ScrollPositionDemo />, <ScrollDirectionDemo />, <ScrollProgressDemo />, <ScrollLockDemo />],
  },
  {
    id: "resize",
    label: "📐 Resize",
    demos: [<ResizeObserverDemo />, <WindowSizeDemo />],
  },
  {
    id: "media",
    label: "🎛 Clipboard & Media",
    demos: [<CopyDemo />, <MediaQueryDemo />, <TextSelectionDemo />, <DropZoneDemo />],
  },
  {
    id: "device",
    label: "📡 Device & Sensors",
    demos: [<DeviceOrientationDemo />, <GeolocationDemo />, <NetworkStatusDemo />, <BatteryDemo />, <VibrateDemo />],
  },
];

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("pointer");

  return (
    <div style={s.page}>
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      <header style={s.header}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={s.headerTitle}>react-interaction-hooks</span>
          <span style={s.headerSub}>33 hooks — interactive playground</span>
        </div>
      </header>

      <div style={s.layout}>
        {/* Sidebar */}
        <nav style={s.sidebar}>
          {sections.map((sec) => (
            <button key={sec.id} style={s.navItem(active === sec.id)} onClick={() => {
              setActive(sec.id);
              document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
            }}>
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={s.content}>
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} style={s.section}>
              <div style={s.sectionTitle}>{sec.label}</div>
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
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 200, background: "#e2e8f0" }}>
      <div style={{ height: "100%", background: "#6366f1", width: `${p * 100}%`, transition: "width 0.05s" }} />
    </div>
  );
}
