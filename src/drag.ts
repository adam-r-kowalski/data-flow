import { Accessor, createSignal, onCleanup } from "solid-js"
import { sub, Vec2, zero } from "./vec2"

type OnDrag = (delta: Vec2) => void

interface Pointer {
    id: number
    position: Vec2
}

const empty: Pointer = { id: -1, position: zero }

const transform = (e: PointerEvent): Pointer => ({
    id: e.pointerId,
    position: [e.clientX, e.clientY],
})

export const drag = (el: HTMLElement, accessor: Accessor<OnDrag>): void => {
    const [pointer, setPointer] = createSignal(empty)
    const callback = accessor()
    const onPointerDown = (e: PointerEvent) => setPointer(transform(e))
    const onPointerUp = (e: PointerEvent) => {
        if (pointer().id !== e.pointerId) return
        setPointer(empty)
    }
    const onPointerMove = (e: PointerEvent) => {
        if (pointer().id !== e.pointerId) return
        const p = transform(e)
        callback(sub(pointer().position, p.position))
        setPointer(p)
    }
    el.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointermove", onPointerMove)
    onCleanup(() => {
        el.removeEventListener("pointerdown", onPointerDown)
        document.removeEventListener("pointerup", onPointerUp)
        document.removeEventListener("pointermove", onPointerMove)
    })
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            drag: OnDrag
        }
    }
}
