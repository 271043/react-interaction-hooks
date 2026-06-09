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

export { useArrowNavigation, useBattery, useContextMenu, useCopyToClipboard, useDeviceOrientation, useDoubleTap, useDrag, useDropZone, useFocusTrap, useFocusWithin, useGeolocation, useHover, useIdle, useIntersectionObserver, useKeyCombo, useKeyPress, useLongPress, useMediaQuery, useMouseLeaveWindow, useNetworkStatus, useOutsideClick, usePageVisibility, usePinch, usePointerPosition, useResizeObserver, useScrollDirection, useScrollLock, useScrollPosition, useScrollProgress, useSwipe, useTextSelection, useVibrate, useWindowSize };
