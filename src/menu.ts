import { IconTypes } from "solid-icons"
import { createSignal } from "solid-js"

import { Vec2 } from "./vec2"

export interface Option {
    icon: IconTypes
    onClick: () => void
}

export type Options = Option[]

interface Show {
    position: Vec2
    options: Options
}

export interface Menu {
    visible: () => boolean
    position: () => Vec2
    show: (show: Show) => void
    hide: () => void
    options: () => Options
}

export const createMenu = (): Menu => {
    const [visible, setVisible] = createSignal(false)
    const [position, setPosition] = createSignal<Vec2>([0, 0])
    const [options, setOptions] = createSignal<Options>([])
    return {
        visible,
        position,
        show: ({ position, options }: Show) => {
            setVisible(true)
            setPosition(position)
            setOptions(options)
        },
        hide: () => setVisible(false),
        options,
    }
}
