import { Accessor, createSignal, onCleanup } from "solid-js"

export interface Drag {
    dx: number
    dy: number
}

interface Callbacks {
    onDragStart?: () => void
    onDrag: (drag: Drag) => void
    onDragStop?: () => void
}

export const drag = (el: HTMLElement, accessor: Accessor<Callbacks>): void => {
    const [pointer, setPointer] = createSignal({ x: 0, y: 0, id: -1 })
    const onPointerMove = (e: PointerEvent) => {
        if (pointer().id !== e.pointerId) return
        const { id, x, y } = pointer()
        accessor().onDrag({ dx: e.clientX - x, dy: e.clientY - y })
        setPointer({ x: e.clientX, y: e.clientY, id })
    }
    const onPointerUp = (e: PointerEvent) => {
        if (pointer().id !== e.pointerId) return
        document.removeEventListener("pointermove", onPointerMove)
        document.removeEventListener("pointerup", onPointerUp)
        accessor().onDragStop?.()
        setPointer({ x: 0, y: 0, id: -1 })
    }
    const onPointerDown = (e: PointerEvent) => {
        if (pointer().id !== -1) return
        document.addEventListener("pointermove", onPointerMove)
        document.addEventListener("pointerup", onPointerUp)
        accessor().onDragStart?.()
        setPointer({ x: e.clientX, y: e.clientY, id: e.pointerId })
    }
    el.addEventListener("pointerdown", onPointerDown)
    onCleanup(() => el.removeEventListener("pointerdown", onPointerDown))
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            drag: Callbacks
        }
    }
}
