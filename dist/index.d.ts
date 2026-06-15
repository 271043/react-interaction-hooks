import { RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;
/**
 * Calls handler when a click or touch occurs outside the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param handler - Called with the MouseEvent or TouchEvent when outside click is detected.
 * @param enabled - When false, disables the listener. Defaults to true.
 * @returns void
 */
declare function useOutsideClick<T extends HTMLElement>(ref: RefObject<T | null>, handler: Handler, enabled?: boolean): void;

/**
 * Prevents body scrolling when locked is true; restores scroll position and styles on unlock.
 *
 * @param locked - When true, applies overflow:hidden + position:fixed to document.body.
 * @returns void
 */
declare function useScrollLock(locked: boolean): void;

interface UseHoverOptions {
    enterDelay?: number;
    leaveDelay?: number;
}
/**
 * Returns true while the pointer hovers over the referenced element, with optional enter/leave delays.
 *
 * @param ref - RefObject attached to the target element.
 * @param options - Optional enterDelay and leaveDelay in ms.
 * @returns boolean — true when hovered.
 */
declare function useHover<T extends HTMLElement>(ref: RefObject<T | null>, options?: UseHoverOptions): boolean;

interface UseKeyComboOptions {
    enabled?: boolean;
    target?: HTMLElement | Document | null;
}
/**
 * Calls callback when a specific key combination (e.g. "ctrl+k") is pressed on the target.
 *
 * @param combo - Key combo string like "ctrl+k", "shift+escape", or just "k".
 * @param callback - Called with the KeyboardEvent when the combo matches.
 * @param options - Optional enabled boolean and target element (default document).
 * @returns void
 */
declare function useKeyCombo(combo: string, callback: (event: KeyboardEvent) => void, options?: UseKeyComboOptions): void;

interface UseLongPressOptions {
    threshold?: number;
    onStart?: () => void;
    onCancel?: () => void;
}
/**
 * Calls callback when a pointer is held down for longer than threshold ms, on mouse and touch.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called after threshold ms of continuous press.
 * @param options - Optional threshold ms (default 500), onStart, onCancel callbacks.
 * @returns void
 */
declare function useLongPress<T extends HTMLElement>(ref: RefObject<T | null>, callback: () => void, options?: UseLongPressOptions): void;

interface DragState {
    isDragging: boolean;
    delta: {
        x: number;
        y: number;
    };
    position: {
        x: number;
        y: number;
    };
}
/**
 * Tracks mouse drag state (isDragging, delta, position) on the referenced element.
 *
 * @param ref - RefObject attached to the draggable element.
 * @returns Object with isDragging boolean, delta {x,y} from drag start, position {x,y} current pointer.
 */
declare function useDrag<T extends HTMLElement>(ref: RefObject<T | null>): DragState;

type SwipeDirection = "left" | "right" | "up" | "down";
interface UseSwipeOptions {
    threshold?: number;
    onSwipe: (direction: SwipeDirection) => void;
}
/**
 * Detects horizontal/vertical swipe direction on touch end for the referenced element.
 *
 * @param ref - RefObject attached to the swipe target.
 * @param options - onSwipe callback (required), optional threshold in px (default 50).
 * @returns void
 */
declare function useSwipe<T extends HTMLElement>(ref: RefObject<T | null>, options: UseSwipeOptions): void;

interface UseDoubleTapOptions {
    threshold?: number;
}
/**
 * Calls callback on double-tap within threshold ms on the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called with the TouchEvent on double-tap.
 * @param options - Optional threshold in ms (default 300).
 * @returns void
 */
declare function useDoubleTap<T extends HTMLElement>(ref: RefObject<T | null>, callback: (event: TouchEvent) => void, options?: UseDoubleTapOptions): void;

interface PinchState {
    scale: number;
    origin: {
        x: number;
        y: number;
    };
}
interface UsePinchOptions {
    onPinch: (state: PinchState) => void;
    onPinchEnd?: (state: PinchState) => void;
}
/**
 * Detects two-finger pinch-zoom gestures on the referenced element via touch events.
 *
 * @param ref - RefObject attached to the pinch target.
 * @param options - onPinch callback with scale and origin, optional onPinchEnd.
 * @returns void
 */
declare function usePinch<T extends HTMLElement>(ref: RefObject<T | null>, options: UsePinchOptions): void;

interface PointerPosition {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
}
/**
 * Returns the current mouse pointer position as page coordinates and client coordinates.
 *
 * @returns Object with x (pageX), y (pageY), clientX, clientY — all 0 initially.
 */
declare function usePointerPosition(): PointerPosition;

/**
 * Returns true while the specified key is held down, false when released.
 *
 * @param targetKey - The key name to track (matches KeyboardEvent.key).
 * @returns boolean — true while the key is pressed.
 */
declare function useKeyPress(targetKey: string): boolean;

/**
 * Traps Tab and Shift+Tab focus within the referenced element when enabled, auto-focusing the first focusable item.
 *
 * @param ref - RefObject attached to the container element.
 * @param enabled - When false, disables the trap. Defaults to true.
 * @returns void
 */
declare function useFocusTrap<T extends HTMLElement>(ref: RefObject<T | null>, enabled?: boolean): void;

interface UseArrowNavigationOptions {
    selector?: string;
    orientation?: "horizontal" | "vertical" | "both";
    loop?: boolean;
}
/**
 * Enables arrow-key navigation between focusable items inside the referenced element.
 *
 * @param ref - RefObject attached to the container element.
 * @param options - Optional selector string, orientation ("vertical"|"horizontal"|"both"), loop boolean.
 * @returns void
 */
declare function useArrowNavigation<T extends HTMLElement>(ref: RefObject<T | null>, options?: UseArrowNavigationOptions): void;

/**
 * Returns true when any descendant of the referenced element currently has focus.
 *
 * @param ref - RefObject attached to the container element.
 * @returns boolean — true while focus is anywhere inside the element.
 */
declare function useFocusWithin<T extends HTMLElement>(ref: RefObject<T | null>): boolean;

interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    rootMargin?: string;
    root?: Element | null;
}
interface IntersectionState {
    isIntersecting: boolean;
    ratio: number;
}
/**
 * Returns {isIntersecting, ratio} from an IntersectionObserver watching the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param options - Optional threshold, rootMargin, root.
 * @returns Object with isIntersecting boolean and ratio number.
 */
declare function useIntersectionObserver<T extends HTMLElement>(ref: RefObject<T | null>, options?: UseIntersectionObserverOptions): IntersectionState;

/**
 * Returns true when no user activity (mouse, keyboard, scroll, touch) has occurred for timeout ms.
 *
 * @param timeout - Inactivity duration in ms before considered idle.
 * @returns boolean — true when user has been idle for timeout ms.
 */
declare function useIdle(timeout: number): boolean;

interface UseCopyToClipboardResult {
    copied: boolean;
    copy: (text: string) => Promise<void>;
}
/**
 * Returns {copied, copy} — copy() writes text to the clipboard and sets copied=true for resetDelay ms.
 *
 * @param resetDelay - Ms before copied resets to false. Defaults to 2000.
 * @returns Object with copied boolean and copy(text) async function.
 */
declare function useCopyToClipboard(resetDelay?: number): UseCopyToClipboardResult;

/**
 * Returns true when the given CSS media query matches, updating on changes.
 *
 * @param query - CSS media query string (e.g. "(max-width: 768px)").
 * @returns boolean — true when the query matches.
 */
declare function useMediaQuery(query: string): boolean;

interface ScrollPosition {
    x: number;
    y: number;
}
/**
 * Returns the current window scroll position, updated on scroll.
 *
 * @returns Object with x (scrollX) and y (scrollY) — both 0 initially.
 */
declare function useScrollPosition(): ScrollPosition;

type ScrollDirection = "up" | "down" | null;
/**
 * Returns "up" or "down" based on the last window scroll movement, null initially.
 *
 * @returns "up" | "down" | null
 */
declare function useScrollDirection(): ScrollDirection;

/**
 * Returns a 0–1 value representing scroll progress of the window or a specific element.
 *
 * @param ref - Optional RefObject for an element; omit to use window scroll progress.
 * @returns number between 0 (top) and 1 (bottom).
 */
declare function useScrollProgress<T extends HTMLElement>(ref?: RefObject<T | null>): number;

interface Size {
    width: number;
    height: number;
}
/**
 * Returns {width, height} of the referenced element using ResizeObserver, updated on resize.
 *
 * @param ref - RefObject attached to the observed element.
 * @returns Object with width and height (both 0 initially).
 */
declare function useResizeObserver<T extends HTMLElement>(ref: RefObject<T | null>): Size;

interface WindowSize {
    width: number;
    height: number;
}
/**
 * Returns the current {width, height} of the browser window, updated on resize.
 *
 * @returns Object with width and height matching window.innerWidth/innerHeight.
 */
declare function useWindowSize(): WindowSize;

interface UseDropZoneOptions {
    onDrop: (files: FileList) => void;
    onDragOver?: () => void;
    onDragLeave?: () => void;
}
interface DropZoneState {
    isOver: boolean;
}
/**
 * Attaches drag-and-drop file handlers to the referenced element, returning isOver state.
 *
 * @param ref - RefObject attached to the drop target element.
 * @param options - onDrop callback (required), optional onDragOver and onDragLeave.
 * @returns Object with isOver boolean.
 */
declare function useDropZone<T extends HTMLElement>(ref: RefObject<T | null>, options: UseDropZoneOptions): DropZoneState;

/**
 * Calls callback and prevents the default browser context menu on right-click of the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called with the MouseEvent on contextmenu event.
 * @returns void
 */
declare function useContextMenu<T extends HTMLElement>(ref: RefObject<T | null>, callback: (event: MouseEvent) => void): void;

/**
 * Calls callback when the mouse pointer exits the browser viewport (relatedTarget === null).
 *
 * @param callback - Called when the pointer leaves the browser window.
 * @returns void
 */
declare function useMouseLeaveWindow(callback: () => void): void;

interface DeviceOrientationState {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}
/**
 * Returns {alpha, beta, gamma} from the DeviceOrientation API, updating on each orientation event.
 *
 * @returns Object with alpha, beta, gamma (all null initially).
 */
declare function useDeviceOrientation(): DeviceOrientationState;

interface GeolocationState {
    loading: boolean;
    position: GeolocationPosition | null;
    error: GeolocationPositionError | null;
}
interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}
/**
 * Returns {loading, position, error} from the Geolocation API watchPosition, updating on location changes.
 *
 * @param options - GeolocationPositionOptions (enableHighAccuracy, timeout, maximumAge).
 * @returns Object with loading boolean, position GeolocationPosition|null, error GeolocationPositionError|null.
 */
declare function useGeolocation(options?: UseGeolocationOptions): GeolocationState;

interface NetworkStatus {
    online: boolean;
    type: string | null;
    effectiveType: string | null;
}
/**
 * Returns {online, type, effectiveType} from navigator.onLine and the Network Information API.
 *
 * @returns Object with online boolean, type string|null, effectiveType string|null.
 */
declare function useNetworkStatus(): NetworkStatus;

interface BatteryState {
    supported: boolean;
    loading: boolean;
    level: number | null;
    charging: boolean | null;
    chargingTime: number | null;
    dischargingTime: number | null;
}
/**
 * Returns battery level, charging state, and charge timing from the Battery Status API.
 *
 * @returns Object with supported, loading, level, charging, chargingTime, dischargingTime.
 */
declare function useBattery(): BatteryState;

/**
 * Returns a function that triggers device vibration via the Vibration API; no-op when unsupported.
 *
 * @returns (pattern: number | number[]) => void
 */
declare function useVibrate(): (pattern: number | number[]) => void;

/**
 * Returns true when the browser tab is visible (document.hidden is false).
 *
 * @returns boolean — true when tab is visible.
 */
declare function usePageVisibility(): boolean;

interface TextSelectionState {
    text: string;
    rect: DOMRect | null;
}
/**
 * Returns the current text selection text and bounding DOMRect, updating on selectionchange events.
 *
 * @returns Object with text (selected string) and rect (DOMRect | null).
 */
declare function useTextSelection(): TextSelectionState;

/**
 * Returns the value after it has not changed for delay ms.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in ms.
 * @returns The debounced value.
 */
declare function useDebounce<T>(value: T, delay: number): T;

/**
 * Returns the value, updating at most once every delay ms.
 *
 * @param value - The value to throttle.
 * @param delay - Throttle interval in ms.
 * @returns The throttled value.
 */
declare function useThrottle<T>(value: T, delay: number): T;

/**
 * Runs callback every delay ms; stops when delay is null.
 *
 * @param callback - Called on each interval tick.
 * @param delay - Interval in ms, or null to pause.
 * @returns void
 */
declare function useInterval(callback: () => void, delay: number | null): void;

/**
 * Fires callback once after delay ms; returns reset() to restart and clear() to cancel.
 *
 * @param callback - Called after delay ms.
 * @param delay - Delay in ms before callback fires.
 * @returns Object with reset() and clear() functions.
 */
declare function useTimeout(callback: () => void, delay: number): {
    reset: () => void;
    clear: () => void;
};

/**
 * Runs callback on every animation frame, passing the elapsed delta time in ms since last frame.
 *
 * @param callback - Called with deltaTime (ms) on each animation frame.
 * @returns void
 */
declare function useAnimationFrame(callback: (deltaTime: number) => void): void;

interface UseCountdownReturn {
    count: number;
    running: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
}
/**
 * Counts down from initialSeconds using a 1-second interval, with start/stop/reset controls.
 *
 * @param initialSeconds - Starting countdown value in seconds.
 * @returns Object with count, running, start(), stop(), reset().
 */
declare function useCountdown(initialSeconds: number): UseCountdownReturn;

/**
 * Calls callback whenever the DOM subtree of the referenced element mutates.
 *
 * @param ref - RefObject attached to the observed element.
 * @param callback - MutationCallback called with mutations list and observer.
 * @param options - MutationObserverInit (default: {childList:true, subtree:true}).
 * @returns void
 */
declare function useMutationObserver(ref: React.RefObject<HTMLElement | null>, callback: MutationCallback, options?: MutationObserverInit): void;

interface ElementSize {
    width: number;
    height: number;
}
/**
 * Returns {width, height} of the referenced element via ResizeObserver and getBoundingClientRect, updated on resize.
 *
 * @param ref - RefObject attached to the target element.
 * @returns Object with width and height (both 0 initially).
 */
declare function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): ElementSize;

interface ElementPosition {
    x: number;
    y: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
/**
 * Returns the DOMRect position (x, y, top, left, right, bottom, width, height) of the referenced element, updated on scroll and resize.
 *
 * @param ref - RefObject attached to the target element.
 * @returns Object with x, y, top, left, right, bottom, width, height (all 0 initially).
 */
declare function useElementPosition<T extends HTMLElement>(ref: RefObject<T | null>): ElementPosition;

interface UseFullscreenReturn {
    isFullscreen: boolean;
    enter: () => Promise<void>;
    exit: () => Promise<void>;
    toggle: () => Promise<void>;
}
/**
 * Returns {isFullscreen, enter, exit, toggle} for managing the Fullscreen API on the referenced element.
 *
 * @param ref - RefObject attached to the element to fullscreen.
 * @returns Object with isFullscreen boolean, enter(), exit(), toggle() async functions.
 */
declare function useFullscreen<T extends HTMLElement>(ref: RefObject<T | null>): UseFullscreenReturn;

interface UseWakeLockReturn {
    supported: boolean;
    active: boolean;
    request: () => Promise<void>;
    release: () => Promise<void>;
}
/**
 * Returns {supported, active, request, release} for the Screen Wake Lock API to prevent display sleep.
 *
 * @returns Object with supported boolean, active boolean, request() async function, release() async function.
 */
declare function useWakeLock(): UseWakeLockReturn;

/**
 * Calls callback with pasted text whenever a paste event fires on the document.
 *
 * @param callback - Called with (text, ClipboardEvent) when text is pasted.
 * @returns void
 */
declare function usePaste(callback: (text: string, event: ClipboardEvent) => void): void;

interface UseDoubleClickOptions {
    threshold?: number;
}
/**
 * Calls callback on custom double-click (two clicks within threshold ms) on the referenced element.
 *
 * @param ref - RefObject attached to the target element.
 * @param callback - Called with the MouseEvent on double-click.
 * @param options - Optional threshold in ms (default 300).
 * @returns void
 */
declare function useDoubleClick<T extends HTMLElement>(ref: RefObject<T | null>, callback: (event: MouseEvent) => void, options?: UseDoubleClickOptions): void;

interface UsePointerLockReturn {
    isLocked: boolean;
    lock: () => Promise<void>;
    unlock: () => void;
}
/**
 * Requests and manages the Pointer Lock API on the referenced element, returning lock/unlock controls.
 *
 * @param ref - RefObject attached to the element to lock pointer to.
 * @returns Object with isLocked boolean, lock() async function, unlock() function.
 */
declare function usePointerLock<T extends HTMLElement>(ref: RefObject<T | null>): UsePointerLockReturn;

/**
 * Calls callback when the exact sequence of keys is pressed in order.
 *
 * @param sequence - Array of key names to match in order (matches KeyboardEvent.key).
 * @param callback - Called when the full sequence is typed.
 * @returns void
 */
declare function useKeySequence(sequence: string[], callback: () => void): void;

/**
 * Returns a function that calls scrollIntoView on the referenced element with the given options.
 *
 * @param ref - RefObject attached to the target element.
 * @param options - ScrollIntoViewOptions (default: smooth scroll to center).
 * @returns () => void — call to scroll element into view.
 */
declare function useScrollIntoView<T extends HTMLElement>(ref: RefObject<T | null>, options?: ScrollIntoViewOptions): () => void;

interface UseScrollSpyOptions {
    threshold?: number;
    rootMargin?: string;
}
/**
 * Returns the index of the ref most visible in the viewport using IntersectionObserver.
 *
 * @param refs - Array of RefObjects to observe.
 * @param options - Optional threshold and rootMargin.
 * @returns number — index of currently intersecting ref (0 initially).
 */
declare function useScrollSpy(refs: RefObject<HTMLElement | null>[], options?: UseScrollSpyOptions): number;

interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
}
/**
 * Calls onLoadMore when the referenced sentinel element enters the viewport; returns loading state.
 *
 * @param ref - RefObject attached to the sentinel/trigger element.
 * @param onLoadMore - Async function called when sentinel intersects.
 * @param options - Optional threshold and rootMargin.
 * @returns Object with loading boolean.
 */
declare function useInfiniteScroll(ref: RefObject<HTMLElement | null>, onLoadMore: () => Promise<void> | void, options?: UseInfiniteScrollOptions): {
    loading: boolean;
};

interface ShareData {
    title?: string;
    text?: string;
    url?: string;
}
interface UseShareReturn {
    supported: boolean;
    share: (data: ShareData) => Promise<void>;
}
/**
 * Returns {supported, share} wrapping the Web Share API; share() is a no-op when unsupported.
 *
 * @returns Object with supported boolean and share(data) async function.
 */
declare function useShare(): UseShareReturn;

type PermissionState = "granted" | "denied" | "prompt";
/**
 * Returns the current state ("granted" | "denied" | "prompt") of the named browser permission, or null if unavailable.
 *
 * @param name - PermissionName to query (e.g. "camera", "notifications").
 * @returns PermissionState | null
 */
declare function usePermission(name: PermissionName): PermissionState | null;

interface UseNotificationReturn {
    permission: NotificationPermission;
    supported: boolean;
    requestPermission: () => Promise<NotificationPermission>;
    notify: (title: string, options?: NotificationOptions) => Notification | null;
}
/**
 * Returns {permission, supported, requestPermission, notify} for creating browser Notifications.
 *
 * @returns Object with permission state, supported boolean, requestPermission() async function, notify() function.
 */
declare function useNotification(): UseNotificationReturn;

/**
 * Returns true if the user has enabled reduced motion in their OS accessibility settings.
 *
 * @returns boolean — matches (prefers-reduced-motion: reduce).
 */
declare function useReducedMotion(): boolean;

/**
 * Returns "dark" or "light" based on the user's prefers-color-scheme OS setting.
 *
 * @returns "dark" | "light"
 */
declare function useColorScheme(): "dark" | "light";

interface UseGamepadReturn {
    gamepads: Gamepad[];
    connected: boolean;
}
/**
 * Returns {gamepads, connected} from the Gamepad API, updating on gamepadconnected/gamepaddisconnected events.
 *
 * @returns Object with gamepads array and connected boolean.
 */
declare function useGamepad(): UseGamepadReturn;

interface UseSpeechRecognitionReturn {
    supported: boolean;
    listening: boolean;
    transcript: string;
    start: () => void;
    stop: () => void;
    reset: () => void;
}
/**
 * Returns {supported, listening, transcript, start, stop, reset} for browser speech-to-text (Web Speech API).
 *
 * @param lang - BCP 47 language tag (default "en-US").
 * @returns Object with supported boolean, listening boolean, transcript string, start(), stop(), reset().
 */
declare function useSpeechRecognition(lang?: string): UseSpeechRecognitionReturn;

interface UseSpeechSynthesisReturn {
    supported: boolean;
    speaking: boolean;
    voices: SpeechSynthesisVoice[];
    speak: (text: string, options?: SpeechSynthesisUtteranceInit) => void;
    cancel: () => void;
}
interface SpeechSynthesisUtteranceInit {
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
}
/**
 * Returns {supported, speaking, voices, speak, cancel} for browser text-to-speech (Web Speech API).
 *
 * @returns Object with supported boolean, speaking boolean, voices array, speak(text, options?), cancel().
 */
declare function useSpeechSynthesis(): UseSpeechSynthesisReturn;

interface UseEyeDropperReturn {
    supported: boolean;
    color: string | null;
    open: () => Promise<string | null>;
}
/**
 * Returns {supported, color, open} for the EyeDropper API to pick a color from the screen.
 *
 * @returns Object with supported boolean, color string|null, open() async function returning picked color hex string or null.
 */
declare function useEyeDropper(): UseEyeDropperReturn;

/**
 * Saves the currently focused element on mount and restores focus to it on unmount.
 *
 * @returns void
 */
declare function useFocusReturn(): void;

/**
 * Returns true when the user is navigating with the keyboard (Tab key was last used), false after mouse interaction.
 *
 * @returns boolean — true after Tab keydown, false after mousedown.
 */
declare function useTabFocus(): boolean;

type BreakpointMap = Record<string, number>;
/**
 * Returns a map of breakpoint-name to boolean indicating whether the element width meets each breakpoint.
 *
 * @param ref - RefObject attached to the container element.
 * @param breakpoints - Record mapping breakpoint name to minimum width in px.
 * @returns Record<string, boolean> updated via ResizeObserver.
 */
declare function useContainerQuery<T extends HTMLElement>(ref: RefObject<T | null>, breakpoints: BreakpointMap): Record<string, boolean>;

export { useAnimationFrame, useArrowNavigation, useBattery, useColorScheme, useContainerQuery, useContextMenu, useCopyToClipboard, useCountdown, useDebounce, useDeviceOrientation, useDoubleClick, useDoubleTap, useDrag, useDropZone, useElementPosition, useElementSize, useEyeDropper, useFocusReturn, useFocusTrap, useFocusWithin, useFullscreen, useGamepad, useGeolocation, useHover, useIdle, useInfiniteScroll, useIntersectionObserver, useInterval, useKeyCombo, useKeyPress, useKeySequence, useLongPress, useMediaQuery, useMouseLeaveWindow, useMutationObserver, useNetworkStatus, useNotification, useOutsideClick, usePageVisibility, usePaste, usePermission, usePinch, usePointerLock, usePointerPosition, useReducedMotion, useResizeObserver, useScrollDirection, useScrollIntoView, useScrollLock, useScrollPosition, useScrollProgress, useScrollSpy, useShare, useSpeechRecognition, useSpeechSynthesis, useSwipe, useTabFocus, useTextSelection, useThrottle, useTimeout, useVibrate, useWakeLock, useWindowSize };
