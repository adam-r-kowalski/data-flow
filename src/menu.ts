import { createSignal } from "solid-js"
import { Vec2 } from "./vec2"

export interface Menu {
    visible: () => boolean
    position: () => Vec2
    show: (position: Vec2) => void
    hide: () => void
}

export const createMenu = () => {
    const [visible, setVisible] = createSignal(false)
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    return {
        visible,
        position,
        show: (position: Vec2) => {
            setVisible(true)
            setPosition(position)
        },
        hide: () => setVisible(false),
    }
}
