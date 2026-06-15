import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const HOOKS: Record<string, {
  description: string;
  params: { name: string; type: string; default?: string; description: string }[];
  returns: string;
  example: string;
}> = {
  useOutsideClick: {
    description: "ตรวจจับการคลิกหรือ touch นอก element ที่กำหนด เหมาะสำหรับ dropdown, modal, popover",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการดู" },
      { name: "handler", type: "(event: MouseEvent | TouchEvent) => void", description: "Callback เมื่อคลิกนอก element" },
      { name: "enabled", type: "boolean", default: "true", description: "เปิด/ปิดการทำงาน" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useOutsideClick } from '@sharpbits/react-interaction-hooks'

function Dropdown() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  useOutsideClick(ref, () => setOpen(false))

  return <div ref={ref}>{open && <Menu />}</div>
}`,
  },

  useScrollLock: {
    description: "ล็อก body scroll เมื่อ locked=true รองรับ iOS Safari ด้วย position:fixed และคืน scroll position เมื่อ unlock",
    params: [
      { name: "locked", type: "boolean", description: "true = ล็อก scroll, false = ปล่อยตามปกติ" },
    ],
    returns: "void",
    example: `import { useScrollLock } from '@sharpbits/react-interaction-hooks'

function Modal({ open }) {
  useScrollLock(open)
  return open ? <div className="modal">...</div> : null
}`,
  },

  useHover: {
    description: "ติดตาม hover state ของ element รองรับ enterDelay และ leaveDelay เพื่อป้องกัน flicker",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการติดตาม" },
      { name: "options.enterDelay", type: "number", default: "0", description: "หน่วง ms ก่อน isHovered = true" },
      { name: "options.leaveDelay", type: "number", default: "0", description: "หน่วง ms ก่อน isHovered = false" },
    ],
    returns: "boolean — isHovered",
    example: `import { useRef } from 'react'
import { useHover } from '@sharpbits/react-interaction-hooks'

function Tooltip() {
  const ref = useRef(null)
  const isHovered = useHover(ref, { enterDelay: 300 })

  return (
    <>
      <button ref={ref}>Hover me</button>
      {isHovered && <div className="tooltip">Hello!</div>}
    </>
  )
}`,
  },

  useKeyCombo: {
    description: "ฟัง keyboard shortcut และเรียก callback — รองรับ Ctrl, Shift, Alt, Meta และทุก key combination",
    params: [
      { name: "combo", type: "string", description: "เช่น 'ctrl+k', 'escape', 'ctrl+shift+p'" },
      { name: "callback", type: "(event: KeyboardEvent) => void", description: "Callback เมื่อกด combo" },
      { name: "options.enabled", type: "boolean", default: "true", description: "เปิด/ปิดการทำงาน" },
      { name: "options.target", type: "HTMLElement | Document", default: "document", description: "Element ที่ attach listener" },
    ],
    returns: "void",
    example: `import { useKeyCombo } from '@sharpbits/react-interaction-hooks'

function SearchBar() {
  useKeyCombo('ctrl+k', (e) => {
    e.preventDefault()
    openSearch()
  })

  useKeyCombo('escape', closeSearch)
}`,
  },

  useLongPress: {
    description: "ตรวจจับการกดค้างบน element ทั้ง mouse และ touch — มี onStart/onCancel callback และ threshold ปรับได้",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ detect" },
      { name: "callback", type: "() => void", description: "Callback เมื่อกดค้างครบ threshold" },
      { name: "options.threshold", type: "number", default: "500", description: "ระยะเวลากดค้าง (ms)" },
      { name: "options.onStart", type: "() => void", description: "Callback เมื่อเริ่มกด" },
      { name: "options.onCancel", type: "() => void", description: "Callback เมื่อปล่อยก่อนครบ threshold" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useLongPress } from '@sharpbits/react-interaction-hooks'

function DeleteButton() {
  const ref = useRef(null)

  useLongPress(ref, () => deleteItem(), {
    threshold: 800,
    onStart: () => showProgress(),
    onCancel: () => hideProgress(),
  })

  return <button ref={ref}>Hold to delete</button>
}`,
  },

  // ── Pointer / Mouse ──────────────────────────────────────────────────────────

  useDrag: {
    description: "ติดตาม drag state ของ element — ให้ isDragging, ระยะเคลื่อนที่ delta และ position ปัจจุบัน",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการติดตาม drag" },
    ],
    returns: "{ isDragging: boolean; delta: { x: number; y: number }; position: { x: number; y: number } }",
    example: `import { useRef } from 'react'
import { useDrag } from '@sharpbits/react-interaction-hooks'

function DraggableCard() {
  const ref = useRef(null)
  const { isDragging, delta } = useDrag(ref)

  return (
    <div ref={ref} style={{ transform: \`translate(\${delta.x}px, \${delta.y}px)\` }}>
      {isDragging ? 'Dragging...' : 'Drag me'}
    </div>
  )
}`,
  },

  useSwipe: {
    description: "ตรวจจับทิศทาง swipe (left/right/up/down) ผ่าน touch events บน element ที่กำหนด",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ detect swipe" },
      { name: "options.onSwipe", type: '(direction: "left"|"right"|"up"|"down") => void', description: "Callback เมื่อ swipe" },
      { name: "options.threshold", type: "number", default: "50", description: "ระยะ px ขั้นต่ำที่นับว่า swipe" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useSwipe } from '@sharpbits/react-interaction-hooks'

function Carousel() {
  const ref = useRef(null)
  useSwipe(ref, {
    onSwipe: (dir) => dir === 'left' ? next() : prev(),
    threshold: 60,
  })
  return <div ref={ref}>...</div>
}`,
  },

  useDoubleTap: {
    description: "ตรวจจับ double-tap บน touch device ภายใน threshold ms และเรียก callback",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ detect" },
      { name: "callback", type: "() => void", description: "Callback เมื่อ double-tap" },
      { name: "options.threshold", type: "number", default: "300", description: "ระยะเวลา ms ระหว่าง tap" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useDoubleTap } from '@sharpbits/react-interaction-hooks'

function LikePhoto() {
  const ref = useRef(null)
  useDoubleTap(ref, () => likePhoto(), { threshold: 250 })
  return <img ref={ref} src={photo.url} alt="photo" />
}`,
  },

  usePinch: {
    description: "ตรวจจับ pinch-zoom gesture บน touch device — ให้ scale และ origin ของการ pinch",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ detect pinch" },
      { name: "options.onPinch", type: "(scale: number, origin: {x:number,y:number}) => void", description: "Callback ระหว่าง pinch" },
      { name: "options.onPinchEnd", type: "(scale: number) => void", description: "Callback เมื่อ pinch สิ้นสุด" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { usePinch } from '@sharpbits/react-interaction-hooks'

function ZoomableImage() {
  const ref = useRef(null)
  usePinch(ref, {
    onPinch: (scale) => setZoom(scale),
    onPinchEnd: (scale) => commitZoom(scale),
  })
  return <div ref={ref}><img src={src} /></div>
}`,
  },

  usePointerPosition: {
    description: "ติดตาม position ของ mouse pointer ทั้ง page coordinates และ client coordinates แบบ real-time",
    params: [],
    returns: "{ x: number; y: number; clientX: number; clientY: number }",
    example: `import { usePointerPosition } from '@sharpbits/react-interaction-hooks'

function CursorFollower() {
  const { x, y } = usePointerPosition()
  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none' }}>
      ✦
    </div>
  )
}`,
  },

  useDoubleClick: {
    description: "ตรวจจับ double-click บน element ด้วย threshold ที่กำหนดเองได้ แทน dblclick event ปกติ",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ detect" },
      { name: "callback", type: "(event: MouseEvent) => void", description: "Callback เมื่อ double-click" },
      { name: "options.threshold", type: "number", default: "300", description: "ระยะเวลา ms ระหว่าง click" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useDoubleClick } from '@sharpbits/react-interaction-hooks'

function EditableTitle() {
  const ref = useRef(null)
  useDoubleClick(ref, () => setEditing(true))
  return <h1 ref={ref}>{title}</h1>
}`,
  },

  usePointerLock: {
    description: "จัดการ Pointer Lock API เพื่อล็อก cursor ไว้ใน element เหมาะสำหรับ game หรือ 3D viewport",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการล็อก pointer" },
    ],
    returns: "{ isLocked: boolean; lock: () => void; unlock: () => void }",
    example: `import { useRef } from 'react'
import { usePointerLock } from '@sharpbits/react-interaction-hooks'

function GameCanvas() {
  const ref = useRef(null)
  const { isLocked, lock, unlock } = usePointerLock(ref)
  return (
    <canvas ref={ref} onClick={lock}>
      {isLocked ? 'Press Esc to unlock' : 'Click to play'}
    </canvas>
  )
}`,
  },

  useDropZone: {
    description: "สร้าง drag-and-drop file drop zone บน element — ให้ isOver state และ callback เมื่อ drop ไฟล์",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่เป็น drop zone" },
      { name: "options.onDrop", type: "(files: FileList) => void", description: "Callback เมื่อ drop ไฟล์" },
      { name: "options.onDragOver", type: "() => void", description: "Callback เมื่อ drag เข้า zone" },
      { name: "options.onDragLeave", type: "() => void", description: "Callback เมื่อ drag ออกจาก zone" },
    ],
    returns: "{ isOver: boolean }",
    example: `import { useRef } from 'react'
import { useDropZone } from '@sharpbits/react-interaction-hooks'

function FileUploader() {
  const ref = useRef(null)
  const { isOver } = useDropZone(ref, {
    onDrop: (files) => uploadFiles(files),
  })
  return (
    <div ref={ref} className={isOver ? 'highlight' : ''}>
      Drop files here
    </div>
  )
}`,
  },

  useContextMenu: {
    description: "ดักจับ right-click context menu บน element และเรียก callback แทนเมนู browser ปกติ",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ intercept context menu" },
      { name: "callback", type: "(event: MouseEvent) => void", description: "Callback เมื่อ right-click" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useContextMenu } from '@sharpbits/react-interaction-hooks'

function FileItem() {
  const ref = useRef(null)
  useContextMenu(ref, (e) => {
    e.preventDefault()
    showCustomMenu({ x: e.clientX, y: e.clientY })
  })
  return <div ref={ref}>file.txt</div>
}`,
  },

  useMouseLeaveWindow: {
    description: "เรียก callback เมื่อ mouse pointer ออกจาก viewport ของ browser เหมาะสำหรับ exit-intent",
    params: [
      { name: "callback", type: "(event: MouseEvent) => void", description: "Callback เมื่อ mouse ออกจาก window" },
    ],
    returns: "void",
    example: `import { useMouseLeaveWindow } from '@sharpbits/react-interaction-hooks'

function ExitIntentModal() {
  const [show, setShow] = useState(false)
  useMouseLeaveWindow(() => setShow(true))
  return show ? <Modal onClose={() => setShow(false)} /> : null
}`,
  },

  // ── Keyboard ─────────────────────────────────────────────────────────────────

  useKeyPress: {
    description: "คืน boolean true ตลอดเวลาที่ผู้ใช้กดปุ่มที่กำหนดค้างไว้",
    params: [
      { name: "targetKey", type: "string", description: "Key name เช่น 'ArrowUp', 'Enter', 'a'" },
    ],
    returns: "boolean — true ขณะที่กดปุ่มค้าง",
    example: `import { useKeyPress } from '@sharpbits/react-interaction-hooks'

function Player() {
  const isUp = useKeyPress('ArrowUp')
  const isDown = useKeyPress('ArrowDown')

  useEffect(() => {
    if (isUp) moveUp()
    if (isDown) moveDown()
  }, [isUp, isDown])

  return <div>Player</div>
}`,
  },

  useKeySequence: {
    description: "เรียก callback เมื่อผู้ใช้พิมพ์ sequence ของ key ตามลำดับที่กำหนด เช่น Konami code",
    params: [
      { name: "sequence", type: "string[]", description: "Array ของ key names ตามลำดับ เช่น ['ArrowUp','ArrowUp','ArrowDown']" },
      { name: "callback", type: "() => void", description: "Callback เมื่อพิมพ์ครบ sequence" },
    ],
    returns: "void",
    example: `import { useKeySequence } from '@sharpbits/react-interaction-hooks'

function KonamiCode() {
  useKeySequence(
    ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','b','a'],
    () => activateCheatMode()
  )
  return <div>Try the Konami code!</div>
}`,
  },

  // ── Focus / Accessibility ─────────────────────────────────────────────────────

  useFocusTrap: {
    description: "กัก Tab focus ไว้ภายใน element — ป้องกันไม่ให้ focus หลุดออกไปนอก modal หรือ dialog",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Container ที่ต้องการกัก focus" },
      { name: "enabled", type: "boolean", default: "true", description: "เปิด/ปิด focus trap" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useFocusTrap } from '@sharpbits/react-interaction-hooks'

function Modal({ open }) {
  const ref = useRef(null)
  useFocusTrap(ref, open)
  return open ? (
    <div ref={ref} role="dialog">
      <button>Action</button>
      <button>Close</button>
    </div>
  ) : null
}`,
  },

  useArrowNavigation: {
    description: "ให้ Arrow key ใช้นำทางระหว่าง focusable items ใน container รองรับ horizontal, vertical และ loop",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Container ของ items" },
      { name: "options.selector", type: "string", default: "'[role=menuitem],[role=option],button,a'", description: "CSS selector ของ items" },
      { name: "options.orientation", type: '"horizontal"|"vertical"|"both"', default: '"vertical"', description: "ทิศทาง navigation" },
      { name: "options.loop", type: "boolean", default: "true", description: "วนกลับเมื่อถึงปลาย" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useArrowNavigation } from '@sharpbits/react-interaction-hooks'

function Menu({ items }) {
  const ref = useRef(null)
  useArrowNavigation(ref, { orientation: 'vertical', loop: true })
  return (
    <ul ref={ref} role="menu">
      {items.map(i => <li key={i} role="menuitem" tabIndex={-1}>{i}</li>)}
    </ul>
  )
}`,
  },

  useFocusWithin: {
    description: "คืน true เมื่อ element ใดๆ ภายใน container มี focus อยู่ คล้าย CSS :focus-within",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Container ที่ต้องการตรวจสอบ" },
    ],
    returns: "boolean — true เมื่อมี focus อยู่ภายใน",
    example: `import { useRef } from 'react'
import { useFocusWithin } from '@sharpbits/react-interaction-hooks'

function FormGroup({ label, children }) {
  const ref = useRef(null)
  const focused = useFocusWithin(ref)
  return (
    <div ref={ref} className={focused ? 'focused' : ''}>
      <label>{label}</label>
      {children}
    </div>
  )
}`,
  },

  useFocusReturn: {
    description: "บันทึก element ที่มี focus อยู่ก่อน mount และคืน focus ให้เมื่อ component unmount",
    params: [],
    returns: "void",
    example: `import { useFocusReturn } from '@sharpbits/react-interaction-hooks'

function Dialog({ onClose }) {
  useFocusReturn()
  return (
    <div role="dialog">
      <p>Dialog content</p>
      <button onClick={onClose}>Close</button>
    </div>
  )
}`,
  },

  useTabFocus: {
    description: "คืน true เมื่อผู้ใช้กำลังใช้ keyboard (Tab key) นำทาง ใช้แสดง focus ring สำหรับ accessibility",
    params: [],
    returns: "boolean — true เมื่อใช้ keyboard navigation",
    example: `import { useTabFocus } from '@sharpbits/react-interaction-hooks'

function App() {
  const isTabbing = useTabFocus()
  return (
    <div className={isTabbing ? 'show-focus-rings' : ''}>
      <nav>...</nav>
    </div>
  )
}`,
  },

  useReducedMotion: {
    description: "คืน true เมื่อ OS ตั้งค่า prefers-reduced-motion เปิดอยู่ ใช้ลด animation สำหรับผู้ใช้ที่ต้องการ",
    params: [],
    returns: "boolean — true เมื่อ prefers-reduced-motion: reduce",
    example: `import { useReducedMotion } from '@sharpbits/react-interaction-hooks'

function AnimatedBanner() {
  const reduced = useReducedMotion()
  return (
    <div style={{ transition: reduced ? 'none' : 'transform 0.5s ease' }}>
      Banner content
    </div>
  )
}`,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────────

  useScrollPosition: {
    description: "ติดตาม scroll position ของ window แบบ real-time คืนค่า x และ y",
    params: [],
    returns: "{ x: number; y: number }",
    example: `import { useScrollPosition } from '@sharpbits/react-interaction-hooks'

function BackToTop() {
  const { y } = useScrollPosition()
  return y > 300 ? (
    <button onClick={() => window.scrollTo(0, 0)}>↑ Top</button>
  ) : null
}`,
  },

  useScrollDirection: {
    description: "ติดตามทิศทาง scroll ล่าสุดของ window คืนค่า 'up', 'down' หรือ null",
    params: [],
    returns: '"up" | "down" | null',
    example: `import { useScrollDirection } from '@sharpbits/react-interaction-hooks'

function Header() {
  const dir = useScrollDirection()
  return (
    <header style={{ transform: dir === 'down' ? 'translateY(-100%)' : 'translateY(0)' }}>
      Logo
    </header>
  )
}`,
  },

  useScrollProgress: {
    description: "คืนค่า scroll progress 0-1 สำหรับ window หรือ element ที่กำหนด ใช้แสดง reading progress bar",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ track (ถ้าไม่ระบุ ใช้ window)" },
    ],
    returns: "number — 0 (top) ถึง 1 (bottom)",
    example: `import { useScrollProgress } from '@sharpbits/react-interaction-hooks'

function Article() {
  const progress = useScrollProgress()
  return (
    <>
      <div style={{ width: \`\${progress * 100}%\` }} className="progress-bar" />
      <article>...</article>
    </>
  )
}`,
  },

  useScrollIntoView: {
    description: "คืน function สำหรับ scroll element เข้าสู่ view พร้อม options เช่น behavior, block, inline",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ scroll ไป" },
      { name: "options", type: "ScrollIntoViewOptions", description: "Options เช่น { behavior: 'smooth', block: 'start' }" },
    ],
    returns: "() => void — function สำหรับ trigger scroll",
    example: `import { useRef } from 'react'
import { useScrollIntoView } from '@sharpbits/react-interaction-hooks'

function Section({ id, children }) {
  const ref = useRef(null)
  const scrollTo = useScrollIntoView(ref, { behavior: 'smooth' })
  return (
    <section ref={ref} id={id}>
      <button onClick={scrollTo}>Scroll here</button>
      {children}
    </section>
  )
}`,
  },

  useScrollSpy: {
    description: "ติดตาม section ที่กำลัง active อยู่ใน viewport คืน index ของ ref ที่กำลัง intersect",
    params: [
      { name: "refs", type: "RefObject<HTMLElement>[]", description: "Array ของ section refs ตามลำดับ" },
      { name: "options.threshold", type: "number", default: "0.5", description: "ค่า intersection threshold" },
      { name: "options.rootMargin", type: "string", default: "'0px'", description: "Root margin สำหรับ IntersectionObserver" },
    ],
    returns: "number — index ของ section ที่ active",
    example: `import { useRef } from 'react'
import { useScrollSpy } from '@sharpbits/react-interaction-hooks'

function TableOfContents({ sections }) {
  const refs = sections.map(() => useRef(null))
  const activeIndex = useScrollSpy(refs, { threshold: 0.5 })
  return (
    <nav>
      {sections.map((s, i) => (
        <a key={s} className={i === activeIndex ? 'active' : ''}>{s}</a>
      ))}
    </nav>
  )
}`,
  },

  useInfiniteScroll: {
    description: "ตรวจจับเมื่อ scroll ถึง sentinel element แล้วเรียก onLoadMore เพื่อโหลดข้อมูลเพิ่ม",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Sentinel element ที่อยู่ท้าย list" },
      { name: "onLoadMore", type: "() => void | Promise<void>", description: "Callback เมื่อต้องโหลดเพิ่ม" },
      { name: "options.threshold", type: "number", default: "0.1", description: "ค่า intersection threshold" },
      { name: "options.rootMargin", type: "string", default: "'0px'", description: "Root margin" },
    ],
    returns: "{ loading: boolean }",
    example: `import { useRef } from 'react'
import { useInfiniteScroll } from '@sharpbits/react-interaction-hooks'

function Feed() {
  const sentinelRef = useRef(null)
  const { loading } = useInfiniteScroll(sentinelRef, () => fetchMore())
  return (
    <>
      {items.map(i => <Card key={i.id} item={i} />)}
      <div ref={sentinelRef}>{loading && <Spinner />}</div>
    </>
  )
}`,
  },

  // ── Resize / Layout ───────────────────────────────────────────────────────────

  useResizeObserver: {
    description: "ใช้ ResizeObserver ติดตามขนาด element แบบ real-time คืน width และ height",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ observe" },
    ],
    returns: "{ width: number; height: number }",
    example: `import { useRef } from 'react'
import { useResizeObserver } from '@sharpbits/react-interaction-hooks'

function ResponsiveChart() {
  const ref = useRef(null)
  const { width, height } = useResizeObserver(ref)
  return (
    <div ref={ref}>
      <canvas width={width} height={height} />
    </div>
  )
}`,
  },

  useWindowSize: {
    description: "ติดตามขนาด window แบบ real-time คืน width และ height ที่อัปเดตเมื่อ resize",
    params: [],
    returns: "{ width: number; height: number }",
    example: `import { useWindowSize } from '@sharpbits/react-interaction-hooks'

function Layout() {
  const { width } = useWindowSize()
  const isMobile = width < 768
  return (
    <div className={isMobile ? 'mobile' : 'desktop'}>
      <Sidebar hidden={isMobile} />
      <Main />
    </div>
  )
}`,
  },

  useElementSize: {
    description: "ติดตามขนาดของ element ผ่าน getBoundingClientRect และ ResizeObserver คืน width, height",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการวัดขนาด" },
    ],
    returns: "{ width: number; height: number }",
    example: `import { useRef } from 'react'
import { useElementSize } from '@sharpbits/react-interaction-hooks'

function TextBox() {
  const ref = useRef(null)
  const { width, height } = useElementSize(ref)
  return (
    <div ref={ref}>
      Size: {width} x {height}
    </div>
  )
}`,
  },

  useElementPosition: {
    description: "ติดตาม position และขนาดของ element ผ่าน DOMRect คืน x, y, top, left, right, bottom, width, height",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการติดตาม position" },
    ],
    returns: "{ x: number; y: number; top: number; left: number; right: number; bottom: number; width: number; height: number }",
    example: `import { useRef } from 'react'
import { useElementPosition } from '@sharpbits/react-interaction-hooks'

function Tooltip({ anchor }) {
  const ref = useRef(null)
  const { top, left, width } = useElementPosition(ref)
  return (
    <>
      <div ref={ref}>{anchor}</div>
      <div style={{ position: 'fixed', top: top - 40, left: left + width / 2 }}>Tip</div>
    </>
  )
}`,
  },

  useContainerQuery: {
    description: "จำลอง CSS Container Queries ใน React คืน Record ของ breakpoint names ที่ match กับขนาด container",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Container element" },
      { name: "breakpoints", type: "Record<string, number>", description: "Map ของ name → min-width เช่น { sm: 300, md: 600 }" },
    ],
    returns: "Record<string, boolean> — แต่ละ key true เมื่อ container กว้างกว่า breakpoint",
    example: `import { useRef } from 'react'
import { useContainerQuery } from '@sharpbits/react-interaction-hooks'

function Card() {
  const ref = useRef(null)
  const { sm, md } = useContainerQuery(ref, { sm: 300, md: 500 })
  return (
    <div ref={ref} className={\`card \${md ? 'card--large' : sm ? 'card--medium' : ''}\`}>
      Content
    </div>
  )
}`,
  },

  useIntersectionObserver: {
    description: "ใช้ IntersectionObserver ตรวจสอบว่า element อยู่ใน viewport หรือไม่ คืน isIntersecting และ ratio",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ observe" },
      { name: "options.threshold", type: "number | number[]", default: "0", description: "Intersection threshold" },
      { name: "options.rootMargin", type: "string", default: "'0px'", description: "Root margin" },
      { name: "options.root", type: "Element | null", default: "null", description: "Root element (null = viewport)" },
    ],
    returns: "{ isIntersecting: boolean; ratio: number }",
    example: `import { useRef } from 'react'
import { useIntersectionObserver } from '@sharpbits/react-interaction-hooks'

function LazyImage({ src }) {
  const ref = useRef(null)
  const { isIntersecting } = useIntersectionObserver(ref, { threshold: 0.1 })
  return <img ref={ref} src={isIntersecting ? src : undefined} />
}`,
  },

  useMutationObserver: {
    description: "ใช้ MutationObserver ฟัง DOM mutations บน element ที่กำหนด เช่น attribute, childList, subtree",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการ observe" },
      { name: "callback", type: "(mutations: MutationRecord[]) => void", description: "Callback เมื่อเกิด mutation" },
      { name: "options", type: "MutationObserverInit", description: "Options เช่น { childList: true, subtree: true }" },
    ],
    returns: "void",
    example: `import { useRef } from 'react'
import { useMutationObserver } from '@sharpbits/react-interaction-hooks'

function DOMWatcher() {
  const ref = useRef(null)
  useMutationObserver(ref, (mutations) => {
    mutations.forEach(m => console.log('Changed:', m.type))
  }, { childList: true, subtree: true })
  return <div ref={ref}><DynamicContent /></div>
}`,
  },

  // ── Clipboard / Text ──────────────────────────────────────────────────────────

  useCopyToClipboard: {
    description: "เขียน text ไปยัง clipboard พร้อม state copied ที่ reset อัตโนมัติหลัง delay ที่กำหนด",
    params: [
      { name: "resetDelay", type: "number", default: "2000", description: "ms ก่อน copied กลับเป็น false" },
    ],
    returns: "{ copied: boolean; copy: (text: string) => void }",
    example: `import { useCopyToClipboard } from '@sharpbits/react-interaction-hooks'

function CopyButton({ text }) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <button onClick={() => copy(text)}>
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  )
}`,
  },

  usePaste: {
    description: "ฟัง paste event และเรียก callback พร้อมข้อความหรือไฟล์ที่ paste เข้ามา",
    params: [
      { name: "callback", type: "(data: string | FileList) => void", description: "Callback เมื่อ paste" },
    ],
    returns: "void",
    example: `import { usePaste } from '@sharpbits/react-interaction-hooks'

function PasteArea() {
  const [content, setContent] = useState('')
  usePaste((data) => {
    if (typeof data === 'string') setContent(data)
  })
  return <div>Paste here: {content}</div>
}`,
  },

  useTextSelection: {
    description: "ติดตาม text selection ปัจจุบันของผู้ใช้ คืน text ที่เลือกและ DOMRect ของ selection",
    params: [],
    returns: "{ text: string; rect: DOMRect | null }",
    example: `import { useTextSelection } from '@sharpbits/react-interaction-hooks'

function SelectionToolbar() {
  const { text, rect } = useTextSelection()
  if (!text || !rect) return null
  return (
    <div style={{ position: 'fixed', top: rect.top - 40, left: rect.left }}>
      <button onClick={() => copy(text)}>Copy</button>
    </div>
  )
}`,
  },

  // ── Timing ────────────────────────────────────────────────────────────────────

  useDebounce: {
    description: "หน่วงการอัปเดตค่า value ออกไป delay ms — ค่าจะอัปเดตเมื่อหยุดเปลี่ยนแปลงครบ delay",
    params: [
      { name: "value", type: "T", description: "ค่าที่ต้องการ debounce" },
      { name: "delay", type: "number", description: "ระยะเวลา debounce (ms)" },
    ],
    returns: "T — ค่าที่ debounced แล้ว",
    example: `import { useDebounce } from '@sharpbits/react-interaction-hooks'

function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) search(debouncedQuery)
  }, [debouncedQuery])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
  },

  useThrottle: {
    description: "จำกัดการอัปเดต value ให้เกิดได้ไม่เกินครั้งหนึ่งต่อ delay ms",
    params: [
      { name: "value", type: "T", description: "ค่าที่ต้องการ throttle" },
      { name: "delay", type: "number", description: "ระยะห่างขั้นต่ำระหว่างการอัปเดต (ms)" },
    ],
    returns: "T — ค่าที่ throttled แล้ว",
    example: `import { useThrottle } from '@sharpbits/react-interaction-hooks'

function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const throttledPos = useThrottle(pos, 100)

  useEffect(() => {
    window.addEventListener('mousemove', e => setPos({ x: e.clientX, y: e.clientY }))
  }, [])

  return <div>X: {throttledPos.x} Y: {throttledPos.y}</div>
}`,
  },

  useInterval: {
    description: "รัน callback ทุกๆ delay ms แบบ declarative — หยุดเมื่อ delay เป็น null หรือ component unmount",
    params: [
      { name: "callback", type: "() => void", description: "Function ที่จะรันซ้ำ" },
      { name: "delay", type: "number | null", description: "ระยะเวลาระหว่าง call (ms) หรือ null เพื่อหยุด" },
    ],
    returns: "void",
    example: `import { useInterval } from '@sharpbits/react-interaction-hooks'

function Clock() {
  const [time, setTime] = useState(new Date())
  useInterval(() => setTime(new Date()), 1000)
  return <div>{time.toLocaleTimeString()}</div>
}`,
  },

  useTimeout: {
    description: "ตั้ง one-shot timeout แบบ declarative คืน reset และ clear functions สำหรับควบคุม",
    params: [
      { name: "callback", type: "() => void", description: "Function ที่จะรันหลัง delay" },
      { name: "delay", type: "number | null", description: "ระยะเวลา (ms) หรือ null เพื่อหยุด" },
    ],
    returns: "{ reset: () => void; clear: () => void }",
    example: `import { useTimeout } from '@sharpbits/react-interaction-hooks'

function Toast({ message, onDismiss }) {
  const { clear } = useTimeout(onDismiss, 3000)
  return (
    <div>
      {message}
      <button onClick={clear}>Keep</button>
    </div>
  )
}`,
  },

  useAnimationFrame: {
    description: "รัน callback ทุก animation frame ผ่าน requestAnimationFrame พร้อม delta time",
    params: [
      { name: "callback", type: "(deltaTime: number) => void", description: "Function ที่รันทุก frame พร้อม delta ms" },
    ],
    returns: "void",
    example: `import { useAnimationFrame } from '@sharpbits/react-interaction-hooks'

function Particle() {
  const [x, setX] = useState(0)
  useAnimationFrame((delta) => {
    setX(prev => (prev + delta * 0.1) % window.innerWidth)
  })
  return <div style={{ position: 'fixed', left: x }}>●</div>
}`,
  },

  useCountdown: {
    description: "Countdown timer แบบ declarative มี start, stop, reset controls และ running state",
    params: [
      { name: "initialSeconds", type: "number", description: "จำนวนวินาทีเริ่มต้น" },
    ],
    returns: "{ count: number; running: boolean; start: () => void; stop: () => void; reset: () => void }",
    example: `import { useCountdown } from '@sharpbits/react-interaction-hooks'

function Quiz() {
  const { count, running, start, stop, reset } = useCountdown(60)
  return (
    <div>
      <p>Time: {count}s</p>
      <button onClick={start} disabled={running}>Start</button>
      <button onClick={stop}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
  },

  useIdle: {
    description: "ตรวจจับเมื่อผู้ใช้ไม่มีการเคลื่อนไหว (mouse, keyboard, touch) เกิน timeout ms",
    params: [
      { name: "timeout", type: "number", description: "ระยะเวลาไม่มีการใช้งาน (ms) ก่อนนับว่า idle" },
    ],
    returns: "boolean — true เมื่อ idle",
    example: `import { useIdle } from '@sharpbits/react-interaction-hooks'

function AutoLogout() {
  const isIdle = useIdle(5 * 60 * 1000) // 5 minutes

  useEffect(() => {
    if (isIdle) logout()
  }, [isIdle])

  return <div>{isIdle ? 'Session expiring...' : 'Active'}</div>
}`,
  },

  // ── Browser / Media ───────────────────────────────────────────────────────────

  useMediaQuery: {
    description: "ติดตาม CSS media query และคืน boolean ที่อัปเดตเมื่อ match state เปลี่ยน",
    params: [
      { name: "query", type: "string", description: "CSS media query string เช่น '(max-width: 768px)'" },
    ],
    returns: "boolean — true เมื่อ media query match",
    example: `import { useMediaQuery } from '@sharpbits/react-interaction-hooks'

function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <HamburgerMenu /> : <DesktopNav />
}`,
  },

  usePageVisibility: {
    description: "ติดตาม Page Visibility API คืน true เมื่อ tab กำลัง visible และ false เมื่อ hidden",
    params: [],
    returns: "boolean — true เมื่อ page visible",
    example: `import { usePageVisibility } from '@sharpbits/react-interaction-hooks'

function VideoPlayer() {
  const isVisible = usePageVisibility()

  useEffect(() => {
    isVisible ? video.play() : video.pause()
  }, [isVisible])

  return <video ref={videoRef} />
}`,
  },

  useColorScheme: {
    description: "ตรวจสอบ system color scheme คืน 'dark' หรือ 'light' ตาม prefers-color-scheme media query",
    params: [],
    returns: '"dark" | "light"',
    example: `import { useColorScheme } from '@sharpbits/react-interaction-hooks'

function ThemeProvider({ children }) {
  const scheme = useColorScheme()
  return (
    <div data-theme={scheme}>
      {children}
    </div>
  )
}`,
  },

  useFullscreen: {
    description: "จัดการ Fullscreen API บน element คืน isFullscreen state และ enter/exit/toggle functions",
    params: [
      { name: "ref", type: "RefObject<HTMLElement>", description: "Element ที่ต้องการแสดงแบบ fullscreen" },
    ],
    returns: "{ isFullscreen: boolean; enter: () => void; exit: () => void; toggle: () => void }",
    example: `import { useRef } from 'react'
import { useFullscreen } from '@sharpbits/react-interaction-hooks'

function VideoPlayer() {
  const ref = useRef(null)
  const { isFullscreen, toggle } = useFullscreen(ref)
  return (
    <div ref={ref}>
      <video src={src} />
      <button onClick={toggle}>{isFullscreen ? 'Exit' : 'Fullscreen'}</button>
    </div>
  )
}`,
  },

  useShare: {
    description: "ใช้ Web Share API แชร์ content ผ่าน native share dialog คืน supported และ share function",
    params: [],
    returns: "{ supported: boolean; share: (data: ShareData) => Promise<void> }",
    example: `import { useShare } from '@sharpbits/react-interaction-hooks'

function ShareButton({ title, url }) {
  const { supported, share } = useShare()
  if (!supported) return null
  return (
    <button onClick={() => share({ title, url })}>
      Share
    </button>
  )
}`,
  },

  usePermission: {
    description: "ดึง permission state ของ browser permission ที่กำหนด เช่น camera, microphone, notifications",
    params: [
      { name: "name", type: "PermissionName", description: "ชื่อ permission เช่น 'camera', 'notifications', 'geolocation'" },
    ],
    returns: 'PermissionState | null — "granted" | "denied" | "prompt" | null',
    example: `import { usePermission } from '@sharpbits/react-interaction-hooks'

function CameraButton() {
  const state = usePermission('camera')
  return (
    <button disabled={state === 'denied'}>
      {state === 'granted' ? 'Open Camera' : 'Allow Camera'}
    </button>
  )
}`,
  },

  useNotification: {
    description: "จัดการ Notifications API — ขอ permission และแสดง notification พร้อม state ของ permission",
    params: [],
    returns: "{ permission: NotificationPermission; supported: boolean; requestPermission: () => Promise<void>; notify: (title: string, options?: NotificationOptions) => void }",
    example: `import { useNotification } from '@sharpbits/react-interaction-hooks'

function AlertButton() {
  const { permission, requestPermission, notify } = useNotification()
  return (
    <button onClick={() => {
      if (permission !== 'granted') requestPermission()
      else notify('Hello!', { body: 'This is a notification' })
    }}>
      Notify Me
    </button>
  )
}`,
  },

  // ── Device / Sensor ───────────────────────────────────────────────────────────

  useNetworkStatus: {
    description: "ติดตาม network connection status คืน online, type (wifi/cellular) และ effectiveType (4g/3g/2g)",
    params: [],
    returns: "{ online: boolean; type: string | null; effectiveType: string | null }",
    example: `import { useNetworkStatus } from '@sharpbits/react-interaction-hooks'

function NetworkBanner() {
  const { online, effectiveType } = useNetworkStatus()
  if (online) return null
  return <div className="banner">You are offline</div>
}`,
  },

  useDeviceOrientation: {
    description: "ติดตาม device orientation ผ่าน DeviceOrientationEvent คืน alpha, beta, gamma (degrees)",
    params: [],
    returns: "{ alpha: number | null; beta: number | null; gamma: number | null }",
    example: `import { useDeviceOrientation } from '@sharpbits/react-interaction-hooks'

function Tilt3D() {
  const { beta, gamma } = useDeviceOrientation()
  return (
    <div style={{ transform: \`rotateX(\${beta}deg) rotateY(\${gamma}deg)\` }}>
      Tilt your device
    </div>
  )
}`,
  },

  useGeolocation: {
    description: "ดึงตำแหน่งทางภูมิศาสตร์ผ่าน Geolocation API พร้อม loading, position, error states",
    params: [
      { name: "options.enableHighAccuracy", type: "boolean", default: "false", description: "ใช้ GPS accuracy สูง" },
      { name: "options.timeout", type: "number", description: "Timeout ms" },
      { name: "options.maximumAge", type: "number", description: "อายุสูงสุดของ cached position (ms)" },
    ],
    returns: "{ loading: boolean; position: GeolocationPosition | null; error: GeolocationPositionError | null }",
    example: `import { useGeolocation } from '@sharpbits/react-interaction-hooks'

function MyLocation() {
  const { loading, position, error } = useGeolocation({ enableHighAccuracy: true })
  if (loading) return <p>Locating...</p>
  if (error) return <p>Error: {error.message}</p>
  return <p>Lat: {position?.coords.latitude}, Lng: {position?.coords.longitude}</p>
}`,
  },

  useBattery: {
    description: "ติดตาม battery status ผ่าน Battery API คืน level, charging, chargingTime, dischargingTime",
    params: [],
    returns: "{ supported: boolean; loading: boolean; level: number; charging: boolean; chargingTime: number; dischargingTime: number }",
    example: `import { useBattery } from '@sharpbits/react-interaction-hooks'

function BatteryIndicator() {
  const { supported, level, charging } = useBattery()
  if (!supported) return null
  return (
    <div>
      {Math.round(level * 100)}% {charging ? '⚡' : '🔋'}
    </div>
  )
}`,
  },

  useVibrate: {
    description: "ควบคุม Vibration API สำหรับสั่น device ตาม pattern ที่กำหนด",
    params: [],
    returns: "(pattern: number | number[]) => void — function สำหรับสั่น",
    example: `import { useVibrate } from '@sharpbits/react-interaction-hooks'

function HapticButton() {
  const vibrate = useVibrate()
  return (
    <button onClick={() => vibrate([100, 50, 100])}>
      Tap for haptic feedback
    </button>
  )
}`,
  },

  useWakeLock: {
    description: "จัดการ Screen Wake Lock API เพื่อป้องกัน screen ดับขณะใช้งาน คืน active, request, release",
    params: [],
    returns: "{ supported: boolean; active: boolean; request: () => Promise<void>; release: () => Promise<void> }",
    example: `import { useWakeLock } from '@sharpbits/react-interaction-hooks'

function PresentationMode() {
  const { supported, active, request, release } = useWakeLock()
  if (!supported) return null
  return (
    <button onClick={active ? release : request}>
      {active ? 'Allow sleep' : 'Keep awake'}
    </button>
  )
}`,
  },

  useGamepad: {
    description: "ติดตาม Gamepad API คืน gamepads ที่เชื่อมต่ออยู่และ connected state",
    params: [],
    returns: "{ gamepads: Gamepad[]; connected: boolean }",
    example: `import { useGamepad } from '@sharpbits/react-interaction-hooks'

function GamepadStatus() {
  const { gamepads, connected } = useGamepad()
  return (
    <div>
      {connected ? \`\${gamepads.length} gamepad(s) connected\` : 'No gamepad'}
    </div>
  )
}`,
  },

  useSpeechRecognition: {
    description: "ใช้ Web Speech API แปลงเสียงพูดเป็น text พร้อม start/stop/reset controls และ transcript",
    params: [
      { name: "lang", type: "string", default: "'en-US'", description: "ภาษาสำหรับ recognition เช่น 'th-TH', 'en-US'" },
    ],
    returns: "{ supported: boolean; listening: boolean; transcript: string; start: () => void; stop: () => void; reset: () => void }",
    example: `import { useSpeechRecognition } from '@sharpbits/react-interaction-hooks'

function VoiceSearch() {
  const { supported, listening, transcript, start, stop } = useSpeechRecognition('en-US')
  if (!supported) return <p>Not supported</p>
  return (
    <div>
      <button onClick={listening ? stop : start}>{listening ? 'Stop' : 'Speak'}</button>
      <p>{transcript}</p>
    </div>
  )
}`,
  },

  useSpeechSynthesis: {
    description: "ใช้ Web Speech Synthesis API แปลง text เป็นเสียงพูด คืน speak, cancel, voices และ speaking state",
    params: [],
    returns: "{ supported: boolean; speaking: boolean; voices: SpeechSynthesisVoice[]; speak: (text: string, options?: SpeechSynthesisUtterance) => void; cancel: () => void }",
    example: `import { useSpeechSynthesis } from '@sharpbits/react-interaction-hooks'

function TextReader({ text }) {
  const { speak, cancel, speaking, voices } = useSpeechSynthesis()
  return (
    <div>
      <button onClick={() => speak(text, { voice: voices[0] })}>Read aloud</button>
      {speaking && <button onClick={cancel}>Stop</button>}
    </div>
  )
}`,
  },

  useEyeDropper: {
    description: "ใช้ EyeDropper API เปิด color picker สำหรับดูดสีจากหน้าจอ คืน color ที่เลือกและ open function",
    params: [],
    returns: "{ supported: boolean; color: string | null; open: () => Promise<void> }",
    example: `import { useEyeDropper } from '@sharpbits/react-interaction-hooks'

function ColorPicker() {
  const { supported, color, open } = useEyeDropper()
  if (!supported) return null
  return (
    <div>
      <button onClick={open}>Pick color</button>
      {color && <div style={{ background: color, width: 32, height: 32 }} />}
    </div>
  )
}`,
  },
};

const server = new Server(
  { name: "@sharpbits/react-interaction-hooks", version: "0.2.7" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_hooks",
      description: "แสดงรายการ hooks ทั้งหมดใน @sharpbits/react-interaction-hooks พร้อม description",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_hook_docs",
      description: "ดู documentation ของ hook ที่ระบุ — params, return type, คำอธิบาย",
      inputSchema: {
        type: "object",
        properties: {
          hook: {
            type: "string",
            description: "ชื่อ hook เช่น useOutsideClick, useHover",
            enum: Object.keys(HOOKS),
          },
        },
        required: ["hook"],
      },
    },
    {
      name: "get_hook_example",
      description: "ดูตัวอย่าง code การใช้งาน hook ที่ระบุ",
      inputSchema: {
        type: "object",
        properties: {
          hook: {
            type: "string",
            description: "ชื่อ hook เช่น useLongPress, useKeyCombo",
            enum: Object.keys(HOOKS),
          },
        },
        required: ["hook"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_hooks") {
    const list = Object.entries(HOOKS)
      .map(([hook, data]) => `• ${hook} — ${data.description}`)
      .join("\n");
    return { content: [{ type: "text", text: list }] };
  }

  if (name === "get_hook_docs") {
    const hook = HOOKS[args?.hook as string];
    if (!hook) return { content: [{ type: "text", text: "ไม่พบ hook นี้" }] };

    const params = hook.params
      .map((p) => {
        const def = p.default ? ` (default: ${p.default})` : "";
        return `  • ${p.name}: ${p.type}${def}\n    ${p.description}`;
      })
      .join("\n");

    const text = [
      `## ${args?.hook}`,
      ``,
      hook.description,
      ``,
      `**Parameters:**`,
      params,
      ``,
      `**Returns:** ${hook.returns}`,
    ].join("\n");

    return { content: [{ type: "text", text }] };
  }

  if (name === "get_hook_example") {
    const hook = HOOKS[args?.hook as string];
    if (!hook) return { content: [{ type: "text", text: "ไม่พบ hook นี้" }] };
    return {
      content: [{ type: "text", text: `\`\`\`tsx\n${hook.example}\n\`\`\`` }],
    };
  }

  return { content: [{ type: "text", text: `ไม่รู้จัก tool: ${name}` }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
