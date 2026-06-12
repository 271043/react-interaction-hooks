import { RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;
declare function useOutsideClick<T extends HTMLElement>(ref: RefObject<T>, handler: Handler, enabled?: boolean): void;

declare function useScrollLock(locked: boolean): void;

interface UseHoverOptions {
    enterDelay?: number;
    leaveDelay?: number;
}
declare function useHover<T extends HTMLElement>(ref: RefObject<T>, options?: UseHoverOptions): boolean;

interface UseKeyComboOptions {
    enabled?: boolean;
    target?: HTMLElement | Document | null;
}
declare function useKeyCombo(combo: string, callback: (event: KeyboardEvent) => void, options?: UseKeyComboOptions): void;

interface UseLongPressOptions {
    threshold?: number;
    onStart?: () => void;
    onCancel?: () => void;
}
declare function useLongPress<T extends HTMLElement>(ref: RefObject<T>, callback: () => void, options?: UseLongPressOptions): void;

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
declare function useDrag<T extends HTMLElement>(ref: RefObject<T>): DragState;

type SwipeDirection = "left" | "right" | "up" | "down";
interface UseSwipeOptions {
    threshold?: number;
    onSwipe: (direction: SwipeDirection) => void;
}
declare function useSwipe<T extends HTMLElement>(ref: RefObject<T>, options: UseSwipeOptions): void;

interface UseDoubleTapOptions {
    threshold?: number;
}
declare function useDoubleTap<T extends HTMLElement>(ref: RefObject<T>, callback: (event: TouchEvent) => void, options?: UseDoubleTapOptions): void;

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
declare function usePinch<T extends HTMLElement>(ref: RefObject<T>, options: UsePinchOptions): void;

interface PointerPosition {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
}
declare function usePointerPosition(): PointerPosition;

declare function useKeyPress(targetKey: string): boolean;

declare function useFocusTrap<T extends HTMLElement>(ref: RefObject<T>, enabled?: boolean): void;

interface UseArrowNavigationOptions {
    selector?: string;
    orientation?: "horizontal" | "vertical" | "both";
    loop?: boolean;
}
declare function useArrowNavigation<T extends HTMLElement>(ref: RefObject<T>, options?: UseArrowNavigationOptions): void;

declare function useFocusWithin<T extends HTMLElement>(ref: RefObject<T>): boolean;

interface UseIntersectionObserverOptions {
    threshold?: number | number[];
    rootMargin?: string;
    root?: Element | null;
}
interface IntersectionState {
    isIntersecting: boolean;
    ratio: number;
}
declare function useIntersectionObserver<T extends HTMLElement>(ref: RefObject<T>, options?: UseIntersectionObserverOptions): IntersectionState;

declare function useIdle(timeout: number): boolean;

interface UseCopyToClipboardResult {
    copied: boolean;
    copy: (text: string) => Promise<void>;
}
declare function useCopyToClipboard(resetDelay?: number): UseCopyToClipboardResult;

declare function useMediaQuery(query: string): boolean;

interface ScrollPosition {
    x: number;
    y: number;
}
declare function useScrollPosition(): ScrollPosition;

type ScrollDirection = "up" | "down" | null;
declare function useScrollDirection(): ScrollDirection;

declare function useScrollProgress<T extends HTMLElement>(ref?: RefObject<T>): number;

interface Size {
    width: number;
    height: number;
}
declare function useResizeObserver<T extends HTMLElement>(ref: RefObject<T>): Size;

interface WindowSize {
    width: number;
    height: number;
}
declare function useWindowSize(): WindowSize;

interface UseDropZoneOptions {
    onDrop: (files: FileList) => void;
    onDragOver?: () => void;
    onDragLeave?: () => void;
}
interface DropZoneState {
    isOver: boolean;
}
declare function useDropZone<T extends HTMLElement>(ref: RefObject<T>, options: UseDropZoneOptions): DropZoneState;

declare function useContextMenu<T extends HTMLElement>(ref: RefObject<T>, callback: (event: MouseEvent) => void): void;

declare function useMouseLeaveWindow(callback: () => void): void;

interface DeviceOrientationState {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}
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
declare function useGeolocation(options?: UseGeolocationOptions): GeolocationState;

interface NetworkStatus {
    online: boolean;
    type: string | null;
    effectiveType: string | null;
}
declare function useNetworkStatus(): NetworkStatus;

interface BatteryState {
    supported: boolean;
    loading: boolean;
    level: number | null;
    charging: boolean | null;
    chargingTime: number | null;
    dischargingTime: number | null;
}
declare function useBattery(): BatteryState;

declare function useVibrate(): (pattern: number | number[]) => void;

declare function usePageVisibility(): boolean;

interface TextSelectionState {
    text: string;
    rect: DOMRect | null;
}
declare function useTextSelection(): TextSelectionState;

declare function useDebounce<T>(value: T, delay: number): T;

declare function useThrottle<T>(value: T, delay: number): T;

declare function useInterval(callback: () => void, delay: number | null): void;

declare function useTimeout(callback: () => void, delay: number): {
    reset: () => void;
    clear: () => void;
};

declare function useAnimationFrame(callback: (deltaTime: number) => void): void;

interface UseCountdownReturn {
    count: number;
    running: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
}
declare function useCountdown(initialSeconds: number): UseCountdownReturn;

declare function useMutationObserver(ref: React.RefObject<HTMLElement>, callback: MutationCallback, options?: MutationObserverInit): void;

interface ElementSize {
    width: number;
    height: number;
}
declare function useElementSize<T extends HTMLElement>(ref: RefObject<T>): ElementSize;

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
declare function useElementPosition<T extends HTMLElement>(ref: RefObject<T>): ElementPosition;

interface UseFullscreenReturn {
    isFullscreen: boolean;
    enter: () => Promise<void>;
    exit: () => Promise<void>;
    toggle: () => Promise<void>;
}
declare function useFullscreen<T extends HTMLElement>(ref: RefObject<T>): UseFullscreenReturn;

interface UseWakeLockReturn {
    supported: boolean;
    active: boolean;
    request: () => Promise<void>;
    release: () => Promise<void>;
}
declare function useWakeLock(): UseWakeLockReturn;

declare function usePaste(callback: (text: string, event: ClipboardEvent) => void): void;

interface UseDoubleClickOptions {
    threshold?: number;
}
declare function useDoubleClick<T extends HTMLElement>(ref: RefObject<T>, callback: (event: MouseEvent) => void, options?: UseDoubleClickOptions): void;

interface UsePointerLockReturn {
    isLocked: boolean;
    lock: () => Promise<void>;
    unlock: () => void;
}
declare function usePointerLock<T extends HTMLElement>(ref: RefObject<T>): UsePointerLockReturn;

declare function useKeySequence(sequence: string[], callback: () => void): void;

declare function useScrollIntoView<T extends HTMLElement>(ref: RefObject<T>, options?: ScrollIntoViewOptions): () => void;

interface UseScrollSpyOptions {
    threshold?: number;
    rootMargin?: string;
}
declare function useScrollSpy(refs: RefObject<HTMLElement>[], options?: UseScrollSpyOptions): number;

interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
}
declare function useInfiniteScroll(ref: RefObject<HTMLElement>, onLoadMore: () => Promise<void> | void, options?: UseInfiniteScrollOptions): {
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
declare function useShare(): UseShareReturn;

type PermissionState = "granted" | "denied" | "prompt";
declare function usePermission(name: PermissionName): PermissionState | null;

interface UseNotificationReturn {
    permission: NotificationPermission;
    supported: boolean;
    requestPermission: () => Promise<NotificationPermission>;
    notify: (title: string, options?: NotificationOptions) => Notification | null;
}
declare function useNotification(): UseNotificationReturn;

declare function useReducedMotion(): boolean;

declare function useColorScheme(): "dark" | "light";

interface UseGamepadReturn {
    gamepads: Gamepad[];
    connected: boolean;
}
declare function useGamepad(): UseGamepadReturn;

interface UseSpeechRecognitionReturn {
    supported: boolean;
    listening: boolean;
    transcript: string;
    start: () => void;
    stop: () => void;
    reset: () => void;
}
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
declare function useSpeechSynthesis(): UseSpeechSynthesisReturn;

interface UseEyeDropperReturn {
    supported: boolean;
    color: string | null;
    open: () => Promise<string | null>;
}
declare function useEyeDropper(): UseEyeDropperReturn;

declare function useFocusReturn(): void;

declare function useTabFocus(): boolean;

type BreakpointMap = Record<string, number>;
declare function useContainerQuery<T extends HTMLElement>(ref: RefObject<T>, breakpoints: BreakpointMap): Record<string, boolean>;

export { useAnimationFrame, useArrowNavigation, useBattery, useColorScheme, useContainerQuery, useContextMenu, useCopyToClipboard, useCountdown, useDebounce, useDeviceOrientation, useDoubleClick, useDoubleTap, useDrag, useDropZone, useElementPosition, useElementSize, useEyeDropper, useFocusReturn, useFocusTrap, useFocusWithin, useFullscreen, useGamepad, useGeolocation, useHover, useIdle, useInfiniteScroll, useIntersectionObserver, useInterval, useKeyCombo, useKeyPress, useKeySequence, useLongPress, useMediaQuery, useMouseLeaveWindow, useMutationObserver, useNetworkStatus, useNotification, useOutsideClick, usePageVisibility, usePaste, usePermission, usePinch, usePointerLock, usePointerPosition, useReducedMotion, useResizeObserver, useScrollDirection, useScrollIntoView, useScrollLock, useScrollPosition, useScrollProgress, useScrollSpy, useShare, useSpeechRecognition, useSpeechSynthesis, useSwipe, useTabFocus, useTextSelection, useThrottle, useTimeout, useVibrate, useWakeLock, useWindowSize };
