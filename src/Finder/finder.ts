import { createSignal } from "solid-js"

import { fuzzyFind } from "./fuzzy_find"
import { Vec2 } from "../vec2"
import { UUID } from "../Graph/graph"
import { base } from "../value"

export enum FinderModeKind {
    INSERT,
    REPLACE,
    HIDDEN,
}

interface FinderModeInsert {
    kind: FinderModeKind.INSERT
    position: Vec2
}

interface FinderModeReplace {
    kind: FinderModeKind.REPLACE
    node: UUID
}

interface FinderModeHidden {
    kind: FinderModeKind.HIDDEN
}

type FinderMode = FinderModeInsert | FinderModeReplace | FinderModeHidden

export interface Finder {
    mode: () => FinderMode
    visible: () => boolean
    show: (mode: FinderModeInsert | FinderModeReplace) => void
    hide: () => void
    search: () => string
    setSearch: (search: string) => void
    filtered: () => string[]
}

const hidden: FinderMode = {
    kind: FinderModeKind.HIDDEN,
}

export const createFinder = (): Finder => {
    const options = Object.keys(base)
    const [mode, setMode] = createSignal<FinderMode>(hidden)
    const [search, setSearch] = createSignal("")
    const filtered = () =>
        options.filter((haystack) => fuzzyFind({ haystack, needle: search() }))
    return {
        mode,
        visible: () => mode().kind !== FinderModeKind.HIDDEN,
        show: (mode: FinderModeInsert | FinderModeReplace) => {
            setMode(mode)
            setSearch("")
        },
        hide: () => setMode(hidden),
        search,
        setSearch,
        filtered,
    }
}
