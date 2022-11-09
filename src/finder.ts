import { createSignal } from "solid-js"
import { Vec2 } from "./vec2"

export interface Finder {
    visible: () => boolean
    show: (position: Vec2) => void
    hide: () => void
    search: () => string
    setSearch: (search: string) => void
    position: () => Vec2
}

export const createFinder = (): Finder => {
    const [visible, setVisible] = createSignal(false)
    const [search, setSearch] = createSignal("")
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    return {
        visible: visible,
        show: (position: Vec2) => {
            setVisible(true)
            setSearch("")
            setPosition(position)
        },
        hide: () => setVisible(false),
        search,
        setSearch,
        position,
    }
}
