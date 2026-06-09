import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
const HOOKS = {
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
};
const server = new Server({ name: "react-interaction-hooks", version: "0.1.2" }, { capabilities: { tools: {} } });
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
        const hook = HOOKS[args?.hook];
        if (!hook)
            return { content: [{ type: "text", text: "ไม่พบ hook นี้" }] };
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
        const hook = HOOKS[args?.hook];
        if (!hook)
            return { content: [{ type: "text", text: "ไม่พบ hook นี้" }] };
        return {
            content: [{ type: "text", text: `\`\`\`tsx\n${hook.example}\n\`\`\`` }],
        };
    }
    return { content: [{ type: "text", text: `ไม่รู้จัก tool: ${name}` }] };
});
const transport = new StdioServerTransport();
await server.connect(transport);
