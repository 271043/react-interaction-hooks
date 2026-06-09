# @sharpbits/react-interaction-hooks

A collection of **33 React hooks** for UI interactions — pointer, touch, keyboard, focus, scroll, resize, clipboard, device sensors, and more. Zero dependencies, tree-shakeable, and lightning fast.

[![npm](https://img.shields.io/npm/v/@sharpbits/react-interaction-hooks)](https://www.npmjs.com/package/@sharpbits/react-interaction-hooks)
[![license](https://img.shields.io/npm/l/@sharpbits/react-interaction-hooks)](./LICENSE)

## Installation

```bash
npm install @sharpbits/react-interaction-hooks
```

## Hooks

### 🖱 Pointer & Mouse
| Hook | Description |
|------|-------------|
| [`useOutsideClick`](#useoutsideclick) | Detect clicks/touches outside an element |
| [`useHover`](#usehover) | Track hover state with optional delay |
| [`useDrag`](#usedrag) | Track drag position and delta |
| [`usePointerPosition`](#usepointerposition) | Track mouse position on the page |
| [`useContextMenu`](#usecontextmenu) | Intercept right-click on an element |
| [`useMouseLeaveWindow`](#usemouseleavewindow) | Detect when mouse exits the browser window |

### 👆 Touch
| Hook | Description |
|------|-------------|
| [`useSwipe`](#useswipe) | Detect swipe direction from touch |
| [`useDoubleTap`](#usedoubletap) | Detect double-tap on touch devices |
| [`usePinch`](#usepinch) | Detect pinch-to-zoom gesture |
| [`useLongPress`](#uselongpress) | Detect long press on mouse and touch |

### ⌨️ Keyboard
| Hook | Description |
|------|-------------|
| [`useKeyPress`](#usekeypress) | Track whether a specific key is held down |
| [`useKeyCombo`](#usekeycombo) | Listen for keyboard shortcuts |
| [`useArrowNavigation`](#usearrownavigation) | Navigate a list with arrow keys |
| [`useFocusTrap`](#usefocustrap) | Trap Tab focus inside an element |

### 🎯 Focus & Visibility
| Hook | Description |
|------|-------------|
| [`useFocusWithin`](#usefocuswithin) | Detect focus inside an element |
| [`useIntersectionObserver`](#useintersectionobserver) | Detect when an element enters/leaves the viewport |
| [`useIdle`](#useidle) | Detect user inactivity |
| [`usePageVisibility`](#usepagevisibility) | Detect when the browser tab is hidden |

### 📜 Scroll
| Hook | Description |
|------|-------------|
| [`useScrollPosition`](#usescrollposition) | Track scroll X/Y position |
| [`useScrollDirection`](#usescrolldirection) | Detect scroll direction (up/down) |
| [`useScrollProgress`](#usescrollprogress) | Scroll progress as a 0–1 value |
| [`useScrollLock`](#usescrolllock) | Lock body scroll (iOS Safari safe) |

### 📐 Resize
| Hook | Description |
|------|-------------|
| [`useResizeObserver`](#useresizeobserver) | Track element width/height changes |
| [`useWindowSize`](#usewindowsize) | Track browser window dimensions |

### 🎛 Clipboard & Media
| Hook | Description |
|------|-------------|
| [`useCopyToClipboard`](#usecopytoclipboard) | Copy text to clipboard |
| [`useMediaQuery`](#usemediaquery) | Subscribe to a CSS media query |
| [`useTextSelection`](#usetextselection) | Track selected text and its bounding rect |
| [`useDropZone`](#usedropzone) | Accept file drag-and-drop on an element |

### 📡 Device & Sensors
| Hook | Description |
|------|-------------|
| [`useDeviceOrientation`](#usedeviceorientation) | Read gyroscope orientation (alpha/beta/gamma) |
| [`useGeolocation`](#usegeolocation) | Watch GPS coordinates |
| [`useNetworkStatus`](#usenetworkstatus) | Track online/offline and connection type |
| [`useBattery`](#usebattery) | Read battery level and charging state |
| [`useVibrate`](#usevibrate) | Trigger device vibration |

---

## Reference

### `useOutsideClick`

Fires a callback when the user clicks or touches outside a given element.

```tsx
const ref = useRef<HTMLDivElement>(null)
useOutsideClick(ref, () => setOpen(false))
```

```ts
useOutsideClick(ref, handler, enabled?)
```

| Param | Type | Default |
|-------|------|---------|
| `ref` | `RefObject<HTMLElement>` | — |
| `handler` | `(event: MouseEvent \| TouchEvent) => void` | — |
| `enabled` | `boolean` | `true` |

---

### `useHover`

Returns `true` while the mouse is over the element. Supports enter/leave delays to prevent flickering.

```tsx
const ref = useRef<HTMLDivElement>(null)
const isHovered = useHover(ref, { enterDelay: 200 })
```

```ts
useHover(ref, options?) → boolean
```

| Option | Type | Default |
|--------|------|---------|
| `enterDelay` | `number` (ms) | `0` |
| `leaveDelay` | `number` (ms) | `0` |

---

### `useDrag`

Tracks mouse drag on an element, returning whether a drag is active, the total delta, and the current pointer position.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { isDragging, delta, position } = useDrag(ref)
```

```ts
useDrag(ref) → { isDragging: boolean, delta: {x,y}, position: {x,y} }
```

---

### `usePointerPosition`

Tracks the mouse pointer position across the entire page.

```tsx
const { x, y, clientX, clientY } = usePointerPosition()
```

```ts
usePointerPosition() → { x, y, clientX, clientY }
```

`x`/`y` are page-relative (include scroll); `clientX`/`clientY` are viewport-relative.

---

### `useContextMenu`

Intercepts right-click on an element, prevents the default browser menu, and calls the handler.

```tsx
const ref = useRef<HTMLDivElement>(null)
useContextMenu(ref, (e) => openMenu(e.clientX, e.clientY))
```

```ts
useContextMenu(ref, callback)
```

---

### `useMouseLeaveWindow`

Fires when the mouse pointer exits the browser window entirely. Useful for exit-intent popups.

```tsx
useMouseLeaveWindow(() => setShowExitPopup(true))
```

```ts
useMouseLeaveWindow(callback)
```

---

### `useSwipe`

Detects swipe direction from touch events on an element.

```tsx
const ref = useRef<HTMLDivElement>(null)
useSwipe(ref, {
  onSwipe: (direction) => console.log(direction) // "left" | "right" | "up" | "down"
})
```

```ts
useSwipe(ref, { onSwipe, threshold? })
```

| Option | Type | Default |
|--------|------|---------|
| `onSwipe` | `(dir: "left"\|"right"\|"up"\|"down") => void` | — |
| `threshold` | `number` (px) | `50` |

---

### `useDoubleTap`

Fires a callback when the user double-taps an element (touch only).

```tsx
const ref = useRef<HTMLDivElement>(null)
useDoubleTap(ref, () => like())
```

```ts
useDoubleTap(ref, callback, options?)
```

| Option | Type | Default |
|--------|------|---------|
| `threshold` | `number` (ms between taps) | `300` |

---

### `usePinch`

Tracks a two-finger pinch gesture, reporting scale and midpoint origin.

```tsx
const ref = useRef<HTMLDivElement>(null)
usePinch(ref, {
  onPinch: ({ scale, origin }) => setScale(scale),
  onPinchEnd: ({ scale }) => commitScale(scale),
})
```

```ts
usePinch(ref, { onPinch, onPinchEnd? })
```

`scale` is relative to the start of the gesture (`1.0` = no change).

---

### `useLongPress`

Fires a callback after the user holds down on an element for the specified duration.

```tsx
const ref = useRef<HTMLButtonElement>(null)
useLongPress(ref, () => deleteItem(), {
  threshold: 800,
  onStart: () => showProgressBar(),
  onCancel: () => hideProgressBar(),
})
```

```ts
useLongPress(ref, callback, options?)
```

| Option | Type | Default |
|--------|------|---------|
| `threshold` | `number` (ms) | `500` |
| `onStart` | `() => void` | — |
| `onCancel` | `() => void` | — |

> `onCancel` is **not** called after a successful long press.

---

### `useKeyPress`

Returns `true` while a specific key is held down.

```tsx
const isShiftHeld = useKeyPress("Shift")
const isEscape = useKeyPress("Escape")
```

```ts
useKeyPress(key: string) → boolean
```

Key names follow the [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) spec.

---

### `useKeyCombo`

Listens for a keyboard shortcut and fires a callback.

```tsx
useKeyCombo("ctrl+k", (e) => { e.preventDefault(); openSearch() })
useKeyCombo("ctrl+shift+p", openCommandPalette)
useKeyCombo("escape", closeModal)
```

```ts
useKeyCombo(combo, callback, options?)
```

**Combo syntax:** `"k"` · `"escape"` · `"ctrl+k"` · `"ctrl+shift+k"` · `"meta+k"`

| Option | Type | Default |
|--------|------|---------|
| `enabled` | `boolean` | `true` |
| `target` | `HTMLElement \| Document` | `document` |

---

### `useArrowNavigation`

Handles arrow key navigation within a container, moving focus between focusable children.

```tsx
const ref = useRef<HTMLUListElement>(null)
useArrowNavigation(ref, { orientation: "vertical", loop: true })

return (
  <ul ref={ref}>
    <li tabIndex={0}>Item 1</li>
    <li tabIndex={0}>Item 2</li>
  </ul>
)
```

```ts
useArrowNavigation(ref, options?)
```

| Option | Type | Default |
|--------|------|---------|
| `selector` | `string` | `"[role='option'], [role='menuitem'], li, button"` |
| `orientation` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` |
| `loop` | `boolean` | `true` |

---

### `useFocusTrap`

Traps Tab/Shift+Tab focus inside an element and focuses the first focusable element on activation. Essential for accessible modals and dialogs.

```tsx
const ref = useRef<HTMLDivElement>(null)
useFocusTrap(ref, isModalOpen)

return <div ref={ref}>
  <input />
  <button>Close</button>
</div>
```

```ts
useFocusTrap(ref, enabled?)
```

---

### `useFocusWithin`

Returns `true` when focus is inside an element or any of its descendants.

```tsx
const ref = useRef<HTMLFormElement>(null)
const active = useFocusWithin(ref)
```

```ts
useFocusWithin(ref) → boolean
```

---

### `useIntersectionObserver`

Observes when an element enters or leaves the viewport. Useful for lazy loading and infinite scroll.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { isIntersecting, ratio } = useIntersectionObserver(ref, {
  threshold: 0.5,
})
```

```ts
useIntersectionObserver(ref, options?) → { isIntersecting: boolean, ratio: number }
```

| Option | Type | Default |
|--------|------|---------|
| `threshold` | `number \| number[]` | `0` |
| `rootMargin` | `string` | `"0px"` |
| `root` | `Element \| null` | `null` |

---

### `useIdle`

Returns `true` after the user has had no mouse/keyboard/touch/scroll activity for the given duration.

```tsx
const isIdle = useIdle(30_000) // 30 seconds
if (isIdle) lockScreen()
```

```ts
useIdle(timeout: number) → boolean
```

---

### `usePageVisibility`

Returns `true` when the current browser tab is visible, `false` when hidden (minimised or switched away).

```tsx
const isVisible = usePageVisibility()
useEffect(() => { if (!isVisible) pauseVideo() }, [isVisible])
```

```ts
usePageVisibility() → boolean
```

---

### `useScrollPosition`

Tracks the current scroll position of the window.

```tsx
const { x, y } = useScrollPosition()
```

```ts
useScrollPosition() → { x: number, y: number }
```

---

### `useScrollDirection`

Returns the current scroll direction or `null` before the first scroll.

```tsx
const direction = useScrollDirection() // "up" | "down" | null
```

```ts
useScrollDirection() → "up" | "down" | null
```

---

### `useScrollProgress`

Returns scroll progress as a value from `0` to `1`. Pass a ref to track an element's internal scroll, or omit it to track the page.

```tsx
const progress = useScrollProgress()  // page scroll
const progress = useScrollProgress(ref) // element scroll
```

```ts
useScrollProgress(ref?) → number
```

---

### `useScrollLock`

Locks body scroll when `locked` is `true`. Uses `position: fixed` to prevent bounce on iOS Safari and restores the scroll position on unlock.

```tsx
useScrollLock(isModalOpen)
```

```ts
useScrollLock(locked: boolean): void
```

---

### `useResizeObserver`

Tracks the content dimensions of an element using `ResizeObserver`.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { width, height } = useResizeObserver(ref)
```

```ts
useResizeObserver(ref) → { width: number, height: number }
```

---

### `useWindowSize`

Tracks the browser window's inner dimensions.

```tsx
const { width, height } = useWindowSize()
```

```ts
useWindowSize() → { width: number, height: number }
```

---

### `useCopyToClipboard`

Copies text to the clipboard and provides a `copied` flag that resets after a delay.

```tsx
const { copied, copy } = useCopyToClipboard()

return (
  <button onClick={() => copy("Hello!")}>
    {copied ? "Copied!" : "Copy"}
  </button>
)
```

```ts
useCopyToClipboard(resetDelay?) → { copied: boolean, copy: (text: string) => Promise<void> }
```

| Param | Type | Default |
|-------|------|---------|
| `resetDelay` | `number` (ms) | `2000` |

---

### `useMediaQuery`

Subscribes to a CSS media query and returns whether it currently matches.

```tsx
const isDark = useMediaQuery("(prefers-color-scheme: dark)")
const isMobile = useMediaQuery("(max-width: 768px)")
```

```ts
useMediaQuery(query: string) → boolean
```

---

### `useTextSelection`

Tracks the user's current text selection anywhere on the page.

```tsx
const { text, rect } = useTextSelection()
// rect is the DOMRect of the selection — useful for positioning a tooltip
```

```ts
useTextSelection() → { text: string, rect: DOMRect | null }
```

---

### `useDropZone`

Makes an element a file drop target. Returns `isOver` to indicate an active drag-over state.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { isOver } = useDropZone(ref, {
  onDrop: (files) => uploadFiles(files),
})
```

```ts
useDropZone(ref, { onDrop, onDragOver?, onDragLeave? }) → { isOver: boolean }
```

---

### `useDeviceOrientation`

Reads the device orientation from the gyroscope. Returns `null` values on desktop.

```tsx
const { alpha, beta, gamma } = useDeviceOrientation()
```

```ts
useDeviceOrientation() → { alpha: number | null, beta: number | null, gamma: number | null }
```

---

### `useGeolocation`

Watches GPS coordinates via the Geolocation API.

```tsx
const { loading, position, error } = useGeolocation({ enableHighAccuracy: true })
const lat = position?.coords.latitude
```

```ts
useGeolocation(options?) → { loading, position: GeolocationPosition | null, error: GeolocationPositionError | null }
```

| Option | Type | Default |
|--------|------|---------|
| `enableHighAccuracy` | `boolean` | `false` |
| `timeout` | `number` (ms) | `Infinity` |
| `maximumAge` | `number` (ms) | `0` |

---

### `useNetworkStatus`

Tracks online/offline status and connection type via the Network Information API.

```tsx
const { online, effectiveType } = useNetworkStatus()
// effectiveType: "slow-2g" | "2g" | "3g" | "4g" | null
```

```ts
useNetworkStatus() → { online: boolean, type: string | null, effectiveType: string | null }
```

---

### `useBattery`

Reads battery level and charging state via the Battery Status API (Chrome only).

```tsx
const { supported, loading, level, charging, dischargingTime } = useBattery()
```

```ts
useBattery() → { supported, loading, level: number | null, charging: boolean | null, chargingTime: number | null, dischargingTime: number | null }
```

---

### `useVibrate`

Returns a function that triggers device vibration. No-ops silently on unsupported devices.

```tsx
const vibrate = useVibrate()

vibrate(200)                       // 200ms buzz
vibrate([100, 50, 100])            // pattern: buzz, pause, buzz
vibrate(0)                         // stop
```

```ts
useVibrate() → (pattern: number | number[]) => void
```

---

## Requirements

- React 16.8+

## License

MIT
