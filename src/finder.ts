import { createSignal } from "solid-js"

export interface Finder {
    visible: () => boolean
    show: () => void
    hide: () => void
    search: () => string
    setSearch: (search: string) => void
}

export const createFinder = (): Finder => {
    const [visible, setVisible] = createSignal(false)
    const [search, setSearch] = createSignal("")
    return {
        visible: visible,
        show: () => {
            setVisible(true)
            setSearch("")
        },
        hide: () => setVisible(false),
        search,
        setSearch,
    }
}
