# @sharpbits/react-interaction-hooks

A collection of **63 React hooks** for UI interactions — pointer, touch, keyboard, focus, scroll, resize, clipboard, device sensors, timing, and more. Zero dependencies, tree-shakeable, lightweight, and blazing fast.

[![npm](https://img.shields.io/npm/v/%40sharpbits%2Freact-interaction-hooks)](https://www.npmjs.com/package/@sharpbits/react-interaction-hooks)
[![license](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-6366f1)](https://271043.github.io/react-interaction-hooks/)

## Installation

```bash
npm install @sharpbits/react-interaction-hooks
```

## Hooks

### Pointer & Mouse
| Hook | Description |
|------|-------------|
| [`useOutsideClick`](#useoutsideclick) | Detect clicks/touches outside an element |
| [`useHover`](#usehover) | Track hover state with optional delay |
| [`useDrag`](#usedrag) | Track drag position and delta |
| [`usePointerPosition`](#usepointerposition) | Track mouse position on the page |
| [`useContextMenu`](#usecontextmenu) | Intercept right-click on an element |
| [`useMouseLeaveWindow`](#usemouseleavewindow) | Detect when mouse exits the browser window |
| [`useDoubleClick`](#usedoubleclick) | Detect double-click on an element (mouse) |
| [`usePointerLock`](#usepointerlock) | Lock/unlock pointer for raw mouse movement |

### Touch
| Hook | Description |
|------|-------------|
| [`useSwipe`](#useswipe) | Detect swipe direction from touch |
| [`useDoubleTap`](#usedoubletap) | Detect double-tap on touch devices |
| [`usePinch`](#usepinch) | Detect pinch-to-zoom gesture |
| [`useLongPress`](#uselongpress) | Detect long press on mouse and touch |

### Keyboard
| Hook | Description |
|------|-------------|
| [`useKeyPress`](#usekeypress) | Track whether a specific key is held down |
| [`useKeyCombo`](#usekeycombo) | Listen for keyboard shortcuts |
| [`useArrowNavigation`](#usearrownavigation) | Navigate a list with arrow keys |
| [`useFocusTrap`](#usefocustrap) | Trap Tab focus inside an element |
| [`useKeySequence`](#usekeysequence) | Detect ordered key sequences (Konami code style) |

### Focus & Visibility
| Hook | Description |
|------|-------------|
| [`useFocusWithin`](#usefocuswithin) | Detect focus inside an element |
| [`useIntersectionObserver`](#useintersectionobserver) | Detect when an element enters/leaves the viewport |
| [`useIdle`](#useidle) | Detect user inactivity |
| [`usePageVisibility`](#usepagevisibility) | Detect when the browser tab is hidden |
| [`useFocusReturn`](#usefocusreturn) | Restore focus to the trigger element on unmount |
| [`useTabFocus`](#usetabfocus) | Detect whether user is navigating via keyboard |

### Scroll
| Hook | Description |
|------|-------------|
| [`useScrollPosition`](#usescrollposition) | Track scroll X/Y position |
| [`useScrollDirection`](#usescrolldirection) | Detect scroll direction (up/down) |
| [`useScrollProgress`](#usescrollprogress) | Scroll progress as a 0–1 value |
| [`useScrollLock`](#usescrolllock) | Lock body scroll (iOS Safari safe) |
| [`useScrollIntoView`](#usescrollintoview) | Scroll an element into view programmatically |
| [`useScrollSpy`](#usescrollspy) | Track which section is active based on scroll |
| [`useInfiniteScroll`](#useinfinitescroll) | Trigger a callback when a sentinel element is visible |

### Resize & DOM
| Hook | Description |
|------|-------------|
| [`useResizeObserver`](#useresizeobserver) | Track element width/height changes |
| [`useWindowSize`](#usewindowsize) | Track browser window dimensions |
| [`useElementSize`](#useelementsize) | Track rendered size of an element via ResizeObserver |
| [`useElementPosition`](#useelementposition) | Track viewport-relative position of an element |
| [`useContainerQuery`](#usecontainerquery) | Match element width against named breakpoints |
| [`useMutationObserver`](#usemutationobserver) | Observe DOM mutations on an element |
| [`useFullscreen`](#usefullscreen) | Enter/exit fullscreen on an element |

### Clipboard & Media
| Hook | Description |
|------|-------------|
| [`useCopyToClipboard`](#usecopytoclipboard) | Copy text to clipboard |
| [`useMediaQuery`](#usemediaquery) | Subscribe to a CSS media query |
| [`useTextSelection`](#usetextselection) | Track selected text and its bounding rect |
| [`useDropZone`](#usedropzone) | Accept file drag-and-drop on an element |
| [`usePaste`](#usepaste) | Listen for paste events anywhere on the page |
| [`useShare`](#useshare) | Trigger the native Web Share dialog |
| [`usePermission`](#usepermission) | Query browser permission state |
| [`useNotification`](#usenotification) | Request permission and send desktop notifications |
| [`useReducedMotion`](#usereducedmotion) | Detect prefers-reduced-motion preference |
| [`useColorScheme`](#usecolorscheme) | Detect prefers-color-scheme (dark/light) |

### Device & Sensors
| Hook | Description |
|------|-------------|
| [`useDeviceOrientation`](#usedeviceorientation) | Read gyroscope orientation (alpha/beta/gamma) |
| [`useGeolocation`](#usegeolocation) | Watch GPS coordinates |
| [`useNetworkStatus`](#usenetworkstatus) | Track online/offline and connection type |
| [`useBattery`](#usebattery) | Read battery level and charging state |
| [`useVibrate`](#usevibrate) | Trigger device vibration |
| [`useWakeLock`](#usewakelock) | Prevent screen from sleeping |
| [`useGamepad`](#usegamepad) | Detect connected gamepads |
| [`useSpeechRecognition`](#usespeechrecognition) | Convert speech to text via Web Speech API |
| [`useSpeechSynthesis`](#usespeechsynthesis) | Convert text to speech |
| [`useEyeDropper`](#useeyedropper) | Pick a color from the screen |

### Timing
| Hook | Description |
|------|-------------|
| [`useDebounce`](#usedebounce) | Debounce a value by a given delay |
| [`useThrottle`](#usethrottle) | Throttle a value to update at most once per interval |
| [`useInterval`](#useinterval) | Run a callback on a repeating interval |
| [`useTimeout`](#usetimeout) | Run a callback after a delay, with reset/clear |
| [`useAnimationFrame`](#useanimationframe) | Run a callback on every animation frame |
| [`useCountdown`](#usecountdown) | Countdown timer with start, stop, and reset |

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

### `useDoubleClick`

Fires a callback when the user double-clicks an element (mouse only — for touch use `useDoubleTap`).

```tsx
const ref = useRef<HTMLDivElement>(null)
useDoubleClick(ref, () => likePost())
```

```ts
useDoubleClick(ref, callback, options?)
```

| Option | Type | Default |
|--------|------|---------|
| `threshold` | `number` (ms between clicks) | `300` |

---

### `usePointerLock`

Locks the pointer to an element, hiding the cursor and providing raw mouse delta. Used in games and 3D editors.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { isLocked, lock, unlock } = usePointerLock(ref)
```

```ts
usePointerLock(ref) → { isLocked: boolean, lock: () => Promise<void>, unlock: () => void }
```

---

### `useKeySequence`

Fires a callback when the user presses a specific sequence of keys in order.

```tsx
useKeySequence(
  ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"],
  () => activateCheats()
)
```

```ts
useKeySequence(sequence: string[], callback: () => void)
```

---

### `useFocusReturn`

Captures the currently focused element on mount and restores focus to it when the component unmounts. Essential for accessible modals.

```tsx
function Modal() {
  useFocusReturn()
  return <dialog>...</dialog>
}
```

```ts
useFocusReturn() → void
```

---

### `useTabFocus`

Returns `true` when the user is navigating via the Tab key, `false` when using mouse/touch. Useful for showing focus rings only for keyboard users.

```tsx
const isTabFocused = useTabFocus()
```

```ts
useTabFocus() → boolean
```

---

### `useScrollIntoView`

Returns a function that smoothly scrolls a ref element into view.

```tsx
const ref = useRef<HTMLDivElement>(null)
const scrollTo = useScrollIntoView(ref, { behavior: "smooth", block: "center" })

<button onClick={scrollTo}>Go to section</button>
```

```ts
useScrollIntoView(ref, options?) → () => void
```

---

### `useScrollSpy`

Watches multiple section refs and returns the index of the one currently most visible in the viewport.

```tsx
const active = useScrollSpy([ref1, ref2, ref3], { threshold: 0.5 })
```

```ts
useScrollSpy(refs, options?) → number
```

| Option | Type | Default |
|--------|------|---------|
| `threshold` | `number` | `0.5` |
| `rootMargin` | `string` | `"0px"` |

---

### `useInfiniteScroll`

Fires an async callback when a sentinel element enters the viewport. Use a ref on a bottom marker to load more items.

```tsx
const { loading } = useInfiniteScroll(sentinelRef, async () => {
  const more = await fetchNextPage()
  setItems(prev => [...prev, ...more])
})
```

```ts
useInfiniteScroll(ref, onLoadMore, options?) → { loading: boolean }
```

---

### `useElementSize`

Tracks the rendered `width` and `height` of an element using `ResizeObserver` + `getBoundingClientRect`.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { width, height } = useElementSize(ref)
```

```ts
useElementSize(ref) → { width: number, height: number }
```

---

### `useElementPosition`

Tracks the viewport-relative bounding rect of an element, updating on scroll and resize.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { top, left, width, height } = useElementPosition(ref)
```

```ts
useElementPosition(ref) → { x, y, top, left, right, bottom, width, height }
```

---

### `useContainerQuery`

Matches an element's width against named breakpoints using `ResizeObserver`.

```tsx
const ref = useRef<HTMLDivElement>(null)
const matches = useContainerQuery(ref, { sm: 300, md: 600, lg: 900 })
// matches.md === true when element width >= 600px
```

```ts
useContainerQuery(ref, breakpoints: Record<string, number>) → Record<string, boolean>
```

---

### `useMutationObserver`

Observes DOM mutations on an element and fires a callback on each change.

```tsx
const ref = useRef<HTMLDivElement>(null)
useMutationObserver(ref, (mutations) => console.log(mutations))
```

```ts
useMutationObserver(ref, callback, options?)
```

Default `options`: `{ childList: true, subtree: true }`

---

### `useFullscreen`

Controls the Fullscreen API for a given element.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { isFullscreen, enter, exit, toggle } = useFullscreen(ref)
```

```ts
useFullscreen(ref) → { isFullscreen: boolean, enter: () => Promise<void>, exit: () => Promise<void>, toggle: () => Promise<void> }
```

---

### `usePaste`

Listens for `paste` events anywhere on the page and calls the callback with the pasted text.

```tsx
usePaste((text, event) => {
  console.log("Pasted:", text)
})
```

```ts
usePaste(callback: (text: string, event: ClipboardEvent) => void)
```

---

### `useShare`

Wraps the Web Share API. Falls back gracefully on unsupported browsers.

```tsx
const { supported, share } = useShare()
await share({ title: "Hello", url: window.location.href })
```

```ts
useShare() → { supported: boolean, share: (data: ShareData) => Promise<void> }
```

---

### `usePermission`

Queries the Permissions API for the current state of a browser permission.

```tsx
const state = usePermission("camera") // "granted" | "denied" | "prompt" | null
```

```ts
usePermission(name: PermissionName) → "granted" | "denied" | "prompt" | null
```

---

### `useNotification`

Requests notification permission and provides a `notify` helper.

```tsx
const { permission, requestPermission, notify } = useNotification()
await requestPermission()
notify("Hello!", { body: "World" })
```

```ts
useNotification() → { supported, permission, requestPermission, notify }
```

---

### `useReducedMotion`

Returns `true` when the user has requested reduced motion via OS/browser settings.

```tsx
const reduced = useReducedMotion()
const duration = reduced ? 0 : 300
```

```ts
useReducedMotion() → boolean
```

---

### `useColorScheme`

Returns the user's preferred color scheme.

```tsx
const scheme = useColorScheme() // "dark" | "light"
```

```ts
useColorScheme() → "dark" | "light"
```

---

### `useWakeLock`

Prevents the screen from sleeping using the Screen Wake Lock API (Chrome/Edge only).

```tsx
const { supported, active, request, release } = useWakeLock()
```

```ts
useWakeLock() → { supported: boolean, active: boolean, request: () => Promise<void>, release: () => Promise<void> }
```

---

### `useGamepad`

Detects connected gamepads via the Gamepad API.

```tsx
const { gamepads, connected } = useGamepad()
```

```ts
useGamepad() → { gamepads: Gamepad[], connected: boolean }
```

---

### `useSpeechRecognition`

Converts speech to text using the Web Speech API (Chrome/Edge only).

```tsx
const { supported, listening, transcript, start, stop, reset } = useSpeechRecognition()
```

```ts
useSpeechRecognition(lang?) → { supported, listening, transcript, start, stop, reset }
```

| Param | Type | Default |
|-------|------|---------|
| `lang` | `string` | `"en-US"` |

---

### `useSpeechSynthesis`

Converts text to speech using the SpeechSynthesis API.

```tsx
const { speak, speaking, voices, cancel } = useSpeechSynthesis()
speak("Hello world", { rate: 1.2, pitch: 1 })
```

```ts
useSpeechSynthesis() → { supported, speaking, voices, speak, cancel }
```

---

### `useEyeDropper`

Opens the browser's color picker to sample a color from anywhere on the screen (Chrome 95+).

```tsx
const { supported, color, open } = useEyeDropper()
const hex = await open() // e.g. "#ff5733"
```

```ts
useEyeDropper() → { supported: boolean, color: string | null, open: () => Promise<string | null> }
```

---

### `useDebounce`

Returns a debounced copy of a value that only updates after the specified delay.

```tsx
const [search, setSearch] = useState("")
const debounced = useDebounce(search, 400)

useEffect(() => {
  fetchResults(debounced)
}, [debounced])
```

```ts
useDebounce<T>(value: T, delay: number) → T
```

---

### `useThrottle`

Returns a throttled copy of a value that updates at most once per interval.

```tsx
const [pos, setPos] = useState({ x: 0, y: 0 })
const throttled = useThrottle(pos, 100)
```

```ts
useThrottle<T>(value: T, delay: number) → T
```

---

### `useInterval`

Runs a callback on a repeating interval. Pass `null` as the delay to pause.

```tsx
useInterval(() => setCount(c => c + 1), running ? 1000 : null)
```

```ts
useInterval(callback: () => void, delay: number | null)
```

---

### `useTimeout`

Fires a callback after a delay. Returns `reset` and `clear` controls.

```tsx
const { reset, clear } = useTimeout(() => setFired(true), 3000)
```

```ts
useTimeout(callback, delay) → { reset: () => void, clear: () => void }
```

---

### `useAnimationFrame`

Calls a callback on every animation frame, passing the delta time since the last frame.

```tsx
useAnimationFrame((deltaTime) => {
  setAngle(a => (a + deltaTime * 0.1) % 360)
})
```

```ts
useAnimationFrame(callback: (deltaTime: number) => void)
```

---

### `useCountdown`

A countdown timer with start, stop, and reset controls.

```tsx
const { count, running, start, stop, reset } = useCountdown(60)
```

```ts
useCountdown(initialSeconds: number) → { count, running, start, stop, reset }
```

---

## Requirements

- React 16.8+

## License

MIT
