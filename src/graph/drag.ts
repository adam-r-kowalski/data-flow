import { Accessor, createSignal, onCleanup } from "solid-js"

export interface Delta {
    dx: number
    dy: number
}

export type OnDrag = (delta: Delta) => void

interface Position {
    x: number
    y: number
}

interface Pointer {
    id: number
    position: Position
}

const empty: Pointer = { id: -1, position: { x: 0, y: 0 } }

const transform = (e: PointerEvent): Pointer => ({
    id: e.pointerId,
    position: { x: e.clientX, y: e.clientY },
})

export const drag = (el: HTMLElement, accessor: Accessor<OnDrag>): void => {
    const [pointer, setPointer] = createSignal(empty)
    const callback = accessor()
    const onPointerDown = (e: PointerEvent) => {
        setPointer(transform(e))
        e.stopPropagation()
    }
    const onPointerUp = (e: PointerEvent) => {
        if (pointer().id !== e.pointerId) return
        setPointer(empty)
    }
    const onPointerMove = (e: PointerEvent) => {
        if (pointer().id !== e.pointerId) return
        const p = transform(e)
        callback({
            dx: pointer().position.x - p.position.x,
            dy: pointer().position.y - p.position.y,
        })
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
