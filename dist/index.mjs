import { useEffect, useState, useRef, useCallback } from 'react';

// src/hooks/useOutsideClick.ts
function useOutsideClick(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event) => {
      const el = ref.current;
      if (!el || el.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const original = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      body.style.overflow = original.overflow;
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
function useHover(ref, options = {}) {
  const { enterDelay = 0, leaveDelay = 0 } = options;
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    const handleEnter = () => {
      clearTimer();
      if (enterDelay > 0) {
        timerRef.current = setTimeout(() => setIsHovered(true), enterDelay);
      } else {
        setIsHovered(true);
      }
    };
    const handleLeave = () => {
      clearTimer();
      if (leaveDelay > 0) {
        timerRef.current = setTimeout(() => setIsHovered(false), leaveDelay);
      } else {
        setIsHovered(false);
      }
    };
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      clearTimer();
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, enterDelay, leaveDelay]);
  return isHovered;
}
function parseCombo(combo) {
  const parts = combo.toLowerCase().split("+");
  const modifiers = /* @__PURE__ */ new Set();
  const validModifiers = /* @__PURE__ */ new Set(["ctrl", "shift", "alt", "meta"]);
  let key = "";
  for (const part of parts) {
    if (validModifiers.has(part)) {
      modifiers.add(part);
    } else {
      key = part;
    }
  }
  return { modifiers, key };
}
function useKeyCombo(combo, callback, options = {}) {
  const { enabled = true, target = document } = options;
  const handler = useCallback(
    (event) => {
      const e = event;
      const { modifiers, key } = parseCombo(combo);
      const pressed = e.key.toLowerCase() === key && e.ctrlKey === modifiers.has("ctrl") && e.shiftKey === modifiers.has("shift") && e.altKey === modifiers.has("alt") && e.metaKey === modifiers.has("meta");
      if (pressed) callback(e);
    },
    [combo, callback]
  );
  useEffect(() => {
    if (!enabled || !target) return;
    target.addEventListener("keydown", handler);
    return () => target.removeEventListener("keydown", handler);
  }, [enabled, target, handler]);
}
function useLongPress(ref, callback, options = {}) {
  const { threshold = 500, onStart, onCancel } = options;
  const timerRef = useRef(null);
  const isLongPress = useRef(false);
  const callbackRef = useRef(callback);
  const onStartRef = useRef(onStart);
  const onCancelRef = useRef(onCancel);
  callbackRef.current = callback;
  onStartRef.current = onStart;
  onCancelRef.current = onCancel;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleStart = () => {
      var _a;
      isLongPress.current = false;
      (_a = onStartRef.current) == null ? void 0 : _a.call(onStartRef);
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        callbackRef.current();
      }, threshold);
    };
    const handleCancel = () => {
      var _a;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!isLongPress.current) {
        (_a = onCancelRef.current) == null ? void 0 : _a.call(onCancelRef);
      }
    };
    el.addEventListener("mousedown", handleStart);
    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("mouseup", handleCancel);
    el.addEventListener("mouseleave", handleCancel);
    el.addEventListener("touchend", handleCancel);
    el.addEventListener("touchcancel", handleCancel);
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      el.removeEventListener("mousedown", handleStart);
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("mouseup", handleCancel);
      el.removeEventListener("mouseleave", handleCancel);
      el.removeEventListener("touchend", handleCancel);
      el.removeEventListener("touchcancel", handleCancel);
    };
  }, [ref, threshold]);
}
function useDrag(ref) {
  const [state, setState] = useState({
    isDragging: false,
    delta: { x: 0, y: 0 },
    position: { x: 0, y: 0 }
  });
  const startPos = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleStart = (e) => {
      startPos.current = { x: e.clientX, y: e.clientY };
      setState({ isDragging: true, delta: { x: 0, y: 0 }, position: { x: e.clientX, y: e.clientY } });
    };
    const handleMove = (e) => {
      if (!startPos.current) return;
      setState({
        isDragging: true,
        delta: { x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y },
        position: { x: e.clientX, y: e.clientY }
      });
    };
    const handleEnd = () => {
      startPos.current = null;
      setState((prev) => ({ ...prev, isDragging: false }));
    };
    el.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    return () => {
      el.removeEventListener("mousedown", handleStart);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
    };
  }, [ref]);
  return state;
}
function useSwipe(ref, options) {
  const { threshold = 50, onSwipe } = options;
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;
  const startPos = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleStart = (e) => {
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
    };
    const handleEnd = (e) => {
      if (!startPos.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startPos.current.x;
      const dy = touch.clientY - startPos.current.y;
      startPos.current = null;
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipeRef.current(dx > 0 ? "right" : "left");
      } else {
        onSwipeRef.current(dy > 0 ? "down" : "up");
      }
    };
    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchend", handleEnd);
    };
  }, [ref, threshold]);
}
function useDoubleTap(ref, callback, options = {}) {
  const { threshold = 300 } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const lastTap = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleTap = (e) => {
      const now = Date.now();
      if (now - lastTap.current < threshold) {
        callbackRef.current(e);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    };
    el.addEventListener("touchend", handleTap, { passive: true });
    return () => el.removeEventListener("touchend", handleTap);
  }, [ref, threshold]);
}
function getDistance(t1, t2) {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}
function getMidpoint(t1, t2) {
  return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
}
function usePinch(ref, options) {
  const { onPinch, onPinchEnd } = options;
  const onPinchRef = useRef(onPinch);
  const onPinchEndRef = useRef(onPinchEnd);
  onPinchRef.current = onPinch;
  onPinchEndRef.current = onPinchEnd;
  const initialDistance = useRef(null);
  const lastState = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleStart = (e) => {
      if (e.touches.length !== 2) return;
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    };
    const handleMove = (e) => {
      if (e.touches.length !== 2 || initialDistance.current === null) return;
      const scale = getDistance(e.touches[0], e.touches[1]) / initialDistance.current;
      const origin = getMidpoint(e.touches[0], e.touches[1]);
      lastState.current = { scale, origin };
      onPinchRef.current(lastState.current);
    };
    const handleEnd = () => {
      var _a;
      if (initialDistance.current === null) return;
      initialDistance.current = null;
      if (lastState.current) {
        (_a = onPinchEndRef.current) == null ? void 0 : _a.call(onPinchEndRef, lastState.current);
        lastState.current = null;
      }
    };
    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, [ref]);
}
function usePointerPosition() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0
  });
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.pageX, y: e.pageY, clientX: e.clientX, clientY: e.clientY });
    };
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);
  return position;
}
function useKeyPress(targetKey) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    const handleDown = (e) => {
      if (e.key === targetKey) setPressed(true);
    };
    const handleUp = (e) => {
      if (e.key === targetKey) setPressed(false);
    };
    document.addEventListener("keydown", handleDown);
    document.addEventListener("keyup", handleUp);
    return () => {
      document.removeEventListener("keydown", handleDown);
      document.removeEventListener("keyup", handleUp);
    };
  }, [targetKey]);
  return pressed;
}
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(", ");
function useFocusTrap(ref, enabled = true) {
  useEffect(() => {
    var _a;
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const getFocusable = () => Array.from(el.querySelectorAll(FOCUSABLE_SELECTOR));
    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("keydown", handleKeyDown);
    (_a = getFocusable()[0]) == null ? void 0 : _a.focus();
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [ref, enabled]);
}
function useArrowNavigation(ref, options = {}) {
  const {
    selector = "[role='option'], [role='menuitem'], li, button",
    orientation = "vertical",
    loop = true
  } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleKeyDown = (e) => {
      const items = Array.from(el.querySelectorAll(selector));
      if (!items.length) return;
      const index = items.indexOf(document.activeElement);
      const isVertical = orientation === "vertical" || orientation === "both";
      const isHorizontal = orientation === "horizontal" || orientation === "both";
      let next = -1;
      if (isVertical && e.key === "ArrowDown") {
        next = index < items.length - 1 ? index + 1 : loop ? 0 : index;
      } else if (isVertical && e.key === "ArrowUp") {
        next = index > 0 ? index - 1 : loop ? items.length - 1 : index;
      } else if (isHorizontal && e.key === "ArrowRight") {
        next = index < items.length - 1 ? index + 1 : loop ? 0 : index;
      } else if (isHorizontal && e.key === "ArrowLeft") {
        next = index > 0 ? index - 1 : loop ? items.length - 1 : index;
      }
      if (next !== -1) {
        e.preventDefault();
        items[next].focus();
      }
    };
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [ref, selector, orientation, loop]);
}
function useFocusWithin(ref) {
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleFocusIn = () => setIsFocusWithin(true);
    const handleFocusOut = (e) => {
      if (!el.contains(e.relatedTarget)) {
        setIsFocusWithin(false);
      }
    };
    el.addEventListener("focusin", handleFocusIn);
    el.addEventListener("focusout", handleFocusOut);
    return () => {
      el.removeEventListener("focusin", handleFocusIn);
      el.removeEventListener("focusout", handleFocusOut);
    };
  }, [ref]);
  return isFocusWithin;
}
function useIntersectionObserver(ref, options = {}) {
  const { threshold = 0, rootMargin = "0px", root = null } = options;
  const [state, setState] = useState({ isIntersecting: false, ratio: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState({ isIntersecting: entry.isIntersecting, ratio: entry.intersectionRatio });
      },
      { threshold, rootMargin, root }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, root]);
  return state;
}
var ACTIVITY_EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll", "wheel"];
function useIdle(timeout) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    const reset = () => {
      setIsIdle(false);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsIdle(true), timeout);
    };
    ACTIVITY_EVENTS.forEach((event) => document.addEventListener(event, reset, { passive: true }));
    reset();
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => document.removeEventListener(event, reset));
    };
  }, [timeout]);
  return isIdle;
}
function useCopyToClipboard(resetDelay = 2e3) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    async (text) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    },
    [resetDelay]
  );
  return { copied, copy };
}
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleScroll = () => setPosition({ x: window.scrollX, y: window.scrollY });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return position;
}
function useScrollDirection() {
  const [direction, setDirection] = useState(null);
  const lastY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y === lastY.current) return;
      setDirection(y > lastY.current ? "down" : "up");
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return direction;
}
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    var _a;
    const el = (_a = ref == null ? void 0 : ref.current) != null ? _a : null;
    const handleScroll = () => {
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max <= 0 ? 1 : el.scrollTop / max);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max <= 0 ? 1 : window.scrollY / max);
      }
    };
    const target = el != null ? el : window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, [ref]);
  return progress;
}
function useResizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}
function useDropZone(ref, options) {
  const [isOver, setIsOver] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleDragOver = (e) => {
      var _a, _b;
      e.preventDefault();
      setIsOver(true);
      (_b = (_a = optionsRef.current).onDragOver) == null ? void 0 : _b.call(_a);
    };
    const handleDragLeave = () => {
      var _a, _b;
      setIsOver(false);
      (_b = (_a = optionsRef.current).onDragLeave) == null ? void 0 : _b.call(_a);
    };
    const handleDrop = (e) => {
      var _a;
      e.preventDefault();
      setIsOver(false);
      if ((_a = e.dataTransfer) == null ? void 0 : _a.files.length) {
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
function useContextMenu(ref, callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleContextMenu = (e) => {
      e.preventDefault();
      callbackRef.current(e);
    };
    el.addEventListener("contextmenu", handleContextMenu);
    return () => el.removeEventListener("contextmenu", handleContextMenu);
  }, [ref]);
}
function useMouseLeaveWindow(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.relatedTarget === null) {
        callbackRef.current();
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);
}
function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null
  });
  useEffect(() => {
    const handleOrientation = (e) => {
      setOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);
  return orientation;
}
function useGeolocation(options = {}) {
  const { enableHighAccuracy = false, timeout = Infinity, maximumAge = 0 } = options;
  const [state, setState] = useState({
    loading: true,
    position: null,
    error: null
  });
  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, position: null, error: null });
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (position) => setState({ loading: false, position, error: null }),
      (error) => setState({ loading: false, position: null, error }),
      { enableHighAccuracy, timeout, maximumAge }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [enableHighAccuracy, timeout, maximumAge]);
  return state;
}
function getConnection() {
  var _a, _b, _c;
  return (_c = (_b = (_a = navigator.connection) != null ? _a : navigator.mozConnection) != null ? _b : navigator.webkitConnection) != null ? _c : null;
}
function useNetworkStatus() {
  const [status, setStatus] = useState(() => {
    var _a, _b;
    const conn = getConnection();
    return {
      online: navigator.onLine,
      type: (_a = conn == null ? void 0 : conn.type) != null ? _a : null,
      effectiveType: (_b = conn == null ? void 0 : conn.effectiveType) != null ? _b : null
    };
  });
  useEffect(() => {
    const conn = getConnection();
    const update = () => {
      var _a, _b;
      setStatus({
        online: navigator.onLine,
        type: (_a = conn == null ? void 0 : conn.type) != null ? _a : null,
        effectiveType: (_b = conn == null ? void 0 : conn.effectiveType) != null ? _b : null
      });
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    conn == null ? void 0 : conn.addEventListener("change", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      conn == null ? void 0 : conn.removeEventListener("change", update);
    };
  }, []);
  return status;
}
function useBattery() {
  const [state, setState] = useState({
    supported: "getBattery" in navigator,
    loading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null
  });
  useEffect(() => {
    if (!("getBattery" in navigator)) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }
    let battery;
    const update = () => {
      setState({
        supported: true,
        loading: false,
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      });
    };
    navigator.getBattery().then((b) => {
      battery = b;
      update();
      b.addEventListener("levelchange", update);
      b.addEventListener("chargingchange", update);
      b.addEventListener("chargingtimechange", update);
      b.addEventListener("dischargingtimechange", update);
    });
    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", update);
        battery.removeEventListener("chargingchange", update);
        battery.removeEventListener("chargingtimechange", update);
        battery.removeEventListener("dischargingtimechange", update);
      }
    };
  }, []);
  return state;
}
function useVibrate() {
  return useCallback((pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);
}
function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const handleChange = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleChange);
    return () => document.removeEventListener("visibilitychange", handleChange);
  }, []);
  return isVisible;
}
function useTextSelection() {
  const [selection, setSelection] = useState({ text: "", rect: null });
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setSelection({ text: "", rect: null });
        return;
      }
      setSelection({
        text: sel.toString(),
        rect: sel.getRangeAt(0).getBoundingClientRect()
      });
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);
  return selection;
}
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
function useThrottle(value, delay) {
  const [throttled, setThrottled] = useState(value);
  const lastRan = useRef(Date.now());
  useEffect(() => {
    const remaining = delay - (Date.now() - lastRan.current);
    if (remaining <= 0) {
      setThrottled(value);
      lastRan.current = Date.now();
    } else {
      const timer = setTimeout(() => {
        setThrottled(value);
        lastRan.current = Date.now();
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [value, delay]);
  return throttled;
}
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);
  const timerRef = useRef(null);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const reset = useCallback(() => {
    clear();
    timerRef.current = setTimeout(() => savedCallback.current(), delay);
  }, [clear, delay]);
  useEffect(() => {
    reset();
    return clear;
  }, [reset, clear]);
  return { reset, clear };
}
function useAnimationFrame(callback) {
  const savedCallback = useRef(callback);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(null);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const loop = (time) => {
      const delta = lastTimeRef.current !== null ? time - lastTimeRef.current : 0;
      lastTimeRef.current = time;
      savedCallback.current(delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}
function useCountdown(initialSeconds) {
  const [count, setCount] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);
  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          stop();
          return 0;
        }
        return c - 1;
      });
    }, 1e3);
  }, [stop]);
  const reset = useCallback(() => {
    stop();
    setCount(initialSeconds);
  }, [stop, initialSeconds]);
  return { count, running, start, stop, reset };
}
function useMutationObserver(ref, callback, options = { childList: true, subtree: true }) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver(
      (mutations, obs) => savedCallback.current(mutations, obs)
    );
    observer.observe(el, options);
    return () => observer.disconnect();
  }, [ref, options]);
}
function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
var INITIAL = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function useElementPosition(ref) {
  const [pos, setPos] = useState(INITIAL);
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: r.x,
      y: r.y,
      top: r.top,
      left: r.left,
      right: r.right,
      bottom: r.bottom,
      width: r.width,
      height: r.height
    });
  }, [ref]);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [update]);
  return pos;
}
function useFullscreen(ref) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const enter = useCallback(async () => {
    var _a;
    await ((_a = ref.current) == null ? void 0 : _a.requestFullscreen());
  }, [ref]);
  const exit = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  }, []);
  const toggle = useCallback(async () => {
    var _a;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await ((_a = ref.current) == null ? void 0 : _a.requestFullscreen());
  }, [ref]);
  return { isFullscreen, enter, exit, toggle };
}
function useWakeLock() {
  const supported = "wakeLock" in navigator;
  const [active, setActive] = useState(false);
  const lockRef = { current: null };
  const request = useCallback(async () => {
    if (!supported) return;
    try {
      lockRef.current = await navigator.wakeLock.request("screen");
      lockRef.current.addEventListener("release", () => setActive(false));
      setActive(true);
    } catch (e) {
      setActive(false);
    }
  }, [supported]);
  const release = useCallback(async () => {
    var _a;
    await ((_a = lockRef.current) == null ? void 0 : _a.release());
    lockRef.current = null;
    setActive(false);
  }, []);
  useEffect(() => {
    const reacquire = () => {
      if (active) request();
    };
    document.addEventListener("visibilitychange", reacquire);
    return () => document.removeEventListener("visibilitychange", reacquire);
  }, [active, request]);
  return { supported, active, request, release };
}
function usePaste(callback) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const handler = (e) => {
      var _a, _b;
      const text = (_b = (_a = e.clipboardData) == null ? void 0 : _a.getData("text")) != null ? _b : "";
      savedCallback.current(text, e);
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, []);
}
function useDoubleClick(ref, callback, options = {}) {
  const { threshold = 300 } = options;
  const savedCallback = useRef(callback);
  const lastClick = useRef(0);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e) => {
      const now = Date.now();
      if (now - lastClick.current < threshold) {
        savedCallback.current(e);
        lastClick.current = 0;
      } else {
        lastClick.current = now;
      }
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [ref, threshold]);
}
function usePointerLock(ref) {
  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    const onLock = () => setIsLocked(!!document.pointerLockElement);
    const onError = () => setIsLocked(false);
    document.addEventListener("pointerlockchange", onLock);
    document.addEventListener("pointerlockerror", onError);
    return () => {
      document.removeEventListener("pointerlockchange", onLock);
      document.removeEventListener("pointerlockerror", onError);
    };
  }, []);
  const lock = useCallback(async () => {
    var _a;
    await ((_a = ref.current) == null ? void 0 : _a.requestPointerLock());
  }, [ref]);
  const unlock = useCallback(() => {
    if (document.pointerLockElement) document.exitPointerLock();
  }, []);
  return { isLocked, lock, unlock };
}
function useKeySequence(sequence, callback) {
  const savedCallback = useRef(callback);
  const progress = useRef(0);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === sequence[progress.current]) {
        progress.current += 1;
        if (progress.current === sequence.length) {
          savedCallback.current();
          progress.current = 0;
        }
      } else {
        progress.current = e.key === sequence[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sequence]);
}
function useScrollIntoView(ref, options = { behavior: "smooth", block: "center" }) {
  return useCallback(() => {
    var _a;
    (_a = ref.current) == null ? void 0 : _a.scrollIntoView(options);
  }, [ref, options]);
}
function useScrollSpy(refs, options = {}) {
  const { threshold = 0.5, rootMargin = "0px" } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const observers = [];
    refs.forEach((ref, index) => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { threshold, rootMargin }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [refs, threshold, rootMargin]);
  return activeIndex;
}
function useInfiniteScroll(ref, onLoadMore, options = {}) {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const [loading, setLoading] = useState(false);
  const savedCallback = useRef(onLoadMore);
  useEffect(() => {
    savedCallback.current = onLoadMore;
  }, [onLoadMore]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setLoading(true);
          await savedCallback.current();
          setLoading(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, loading, threshold, rootMargin]);
  return { loading };
}
function useShare() {
  const supported = "share" in navigator;
  const share = useCallback(async (data) => {
    if (!supported) return;
    await navigator.share(data);
  }, [supported]);
  return { supported, share };
}
function usePermission(name) {
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!("permissions" in navigator)) return;
    let permissionStatus;
    navigator.permissions.query({ name }).then((status) => {
      permissionStatus = status;
      setState(status.state);
      status.onchange = () => setState(status.state);
    }).catch(() => {
    });
    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, [name]);
  return state;
}
function useNotification() {
  const supported = "Notification" in window;
  const [permission, setPermission] = useState(
    supported ? Notification.permission : "denied"
  );
  const requestPermission = useCallback(async () => {
    if (!supported) return "denied";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [supported]);
  const notify = useCallback(
    (title, options) => {
      if (!supported || permission !== "granted") return null;
      return new Notification(title, options);
    },
    [supported, permission]
  );
  return { permission, supported, requestPermission, notify };
}
function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return matches;
}
function useColorScheme() {
  const [scheme, setScheme] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setScheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return scheme;
}
function useGamepad() {
  const [gamepads, setGamepads] = useState([]);
  useEffect(() => {
    const update = () => {
      const list = Array.from(navigator.getGamepads()).filter(
        (g) => g !== null
      );
      setGamepads(list);
    };
    window.addEventListener("gamepadconnected", update);
    window.addEventListener("gamepaddisconnected", update);
    return () => {
      window.removeEventListener("gamepadconnected", update);
      window.removeEventListener("gamepaddisconnected", update);
    };
  }, []);
  return { gamepads, connected: gamepads.length > 0 };
}
function getSR() {
  var _a;
  const w = window;
  return (_a = w.SpeechRecognition) != null ? _a : w.webkitSpeechRecognition;
}
function useSpeechRecognition(lang = "en-US") {
  const SR = getSR();
  const supported = !!SR;
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recogRef = useRef(null);
  useEffect(() => {
    if (!SR) return;
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = lang;
    recog.onresult = (e) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join("");
      setTranscript(text);
    };
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    return () => recog.stop();
  }, [SR, lang]);
  const start = useCallback(() => {
    var _a;
    (_a = recogRef.current) == null ? void 0 : _a.start();
    setListening(true);
  }, []);
  const stop = useCallback(() => {
    var _a;
    (_a = recogRef.current) == null ? void 0 : _a.stop();
    setListening(false);
  }, []);
  const reset = useCallback(() => setTranscript(""), []);
  return { supported, listening, transcript, start, stop, reset };
}
function useSpeechSynthesis() {
  const supported = "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported]);
  const speak = useCallback((text, options = {}) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (options.voice) utterance.voice = options.voice;
    if (options.rate !== void 0) utterance.rate = options.rate;
    if (options.pitch !== void 0) utterance.pitch = options.pitch;
    if (options.volume !== void 0) utterance.volume = options.volume;
    if (options.lang) utterance.lang = options.lang;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [supported]);
  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);
  return { supported, speaking, voices, speak, cancel };
}
function getEyeDropper() {
  return window.EyeDropper;
}
function useEyeDropper() {
  const EyeDropper = getEyeDropper();
  const supported = !!EyeDropper;
  const [color, setColor] = useState(null);
  const open = useCallback(async () => {
    if (!EyeDropper) return null;
    try {
      const result = await new EyeDropper().open();
      setColor(result.sRGBHex);
      return result.sRGBHex;
    } catch (e) {
      return null;
    }
  }, [EyeDropper]);
  return { supported, color, open };
}
function useFocusReturn() {
  const returnRef = useRef(null);
  useEffect(() => {
    returnRef.current = document.activeElement;
    return () => {
      var _a;
      (_a = returnRef.current) == null ? void 0 : _a.focus();
    };
  }, []);
}
function useTabFocus() {
  const [isTabFocused, setIsTabFocused] = useState(false);
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Tab") setIsTabFocused(true);
    };
    const onMouseDown = () => setIsTabFocused(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);
  return isTabFocused;
}
function useContainerQuery(ref, breakpoints) {
  const [matches, setMatches] = useState(
    () => Object.fromEntries(Object.keys(breakpoints).map((k) => [k, false]))
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width } = el.getBoundingClientRect();
      setMatches(
        Object.fromEntries(
          Object.entries(breakpoints).map(([k, minWidth]) => [k, width >= minWidth])
        )
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, breakpoints]);
  return matches;
}

export { useAnimationFrame, useArrowNavigation, useBattery, useColorScheme, useContainerQuery, useContextMenu, useCopyToClipboard, useCountdown, useDebounce, useDeviceOrientation, useDoubleClick, useDoubleTap, useDrag, useDropZone, useElementPosition, useElementSize, useEyeDropper, useFocusReturn, useFocusTrap, useFocusWithin, useFullscreen, useGamepad, useGeolocation, useHover, useIdle, useInfiniteScroll, useIntersectionObserver, useInterval, useKeyCombo, useKeyPress, useKeySequence, useLongPress, useMediaQuery, useMouseLeaveWindow, useMutationObserver, useNetworkStatus, useNotification, useOutsideClick, usePageVisibility, usePaste, usePermission, usePinch, usePointerLock, usePointerPosition, useReducedMotion, useResizeObserver, useScrollDirection, useScrollIntoView, useScrollLock, useScrollPosition, useScrollProgress, useScrollSpy, useShare, useSpeechRecognition, useSpeechSynthesis, useSwipe, useTabFocus, useTextSelection, useThrottle, useTimeout, useVibrate, useWakeLock, useWindowSize };
