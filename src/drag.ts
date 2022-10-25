import { Accessor, createSignal, onCleanup } from "solid-js"

interface Delta {
    x: number
    y: number
}

type OnDrag = (delta: Delta) => void

interface Pointer {
    pointerId: number
    clientX: number
    clientY: number
}

const empty: Pointer = {
    pointerId: -1,
    clientX: 0,
    clientY: 0,
}

export const drag = (el: HTMLElement, accessor: Accessor<OnDrag>): void => {
    const [pointer, setPointer] = createSignal(empty)
    const callback = accessor()
    const onPointerDown = (e: PointerEvent) => setPointer(e)
    const onPointerUp = () => setPointer(empty)
    const onPointerMove = (e: PointerEvent) => {
        if (pointer().pointerId === -1) return
        const x = e.clientX - pointer().clientX
        const y = e.clientY - pointer().clientY
        callback({ x, y })
        setPointer(e)
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
