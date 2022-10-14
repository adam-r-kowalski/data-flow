import { Accessor, createSignal, onCleanup } from "solid-js"

export interface Drag {
    dx: number
    dy: number
}

export type OnDrag = (drag: Drag) => void

export const drag = (el: HTMLElement, accessor: Accessor<OnDrag>): void => {
    const [pointer, setPointer] = createSignal({ x: 0, y: 0 })
    const [dragging, setDragging] = createSignal(false)
    const onPointerMove = (e: PointerEvent) => {
        if (!dragging()) return
        const { x, y } = pointer()
        accessor()({ dx: e.clientX - x, dy: e.clientY - y })
        setPointer({ x: e.clientX, y: e.clientY })
    }
    const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove)
        document.removeEventListener("pointerup", onPointerUp)
        setDragging(false)
    }
    const onPointerDown = (e: PointerEvent) => {
        document.addEventListener("pointermove", onPointerMove)
        document.addEventListener("pointerup", onPointerUp)
        setPointer({ x: e.clientX, y: e.clientY })
        setDragging(true)
    }
    el.addEventListener("pointerdown", onPointerDown)
    onCleanup(() => el.removeEventListener("pointerdown", onPointerDown))
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            drag: OnDrag
        }
    }
}
