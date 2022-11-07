import { createSignal } from "solid-js"
import { Vec2 } from "./vec2"

export interface Modifiers {
    wheel: () => boolean
    setWheel: (value: boolean) => void
    space: () => boolean
    setSpace: (value: boolean) => void
    position: () => Vec2
    setPosition: (value: Vec2) => void
}

export const createModifiers = (): Modifiers => {
    const [wheel, setWheel] = createSignal(false)
    const [space, setSpace] = createSignal(false)
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    return {
        wheel,
        setWheel,
        space,
        setSpace,
        position,
        setPosition,
    }
}
