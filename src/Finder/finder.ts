import { createSignal } from "solid-js"
import { fuzzyFind } from "./fuzzy_find"
import { Vec2 } from "../vec2"
import { operations } from "../operations"

export interface Finder {
    visible: () => boolean
    show: (position: Vec2) => void
    hide: () => void
    search: () => string
    setSearch: (search: string) => void
    position: () => Vec2
    filtered: () => string[]
}

export const createFinder = (): Finder => {
    const options = Object.keys(operations)
    const [visible, setVisible] = createSignal(false)
    const [search, setSearch] = createSignal("")
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    const filtered = () =>
        options.filter((haystack) => fuzzyFind({ haystack, needle: search() }))
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
        filtered,
    }
}
