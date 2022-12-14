import { createContext, createSignal, JSXElement, useContext } from "solid-js"
import { Vec2 } from "../vec2"

export interface Root {
    set: (root: HTMLElement) => void
    offset: () => Vec2
    fullOffset: () => Vec2
}

export const createRoot = (): Root => {
    const [root, setRoot] = createSignal(document.body)
    return {
        set: (root: HTMLElement) => setRoot(root),
        offset: () => {
            const { x, y } = root().getBoundingClientRect()
            return [x, y]
        },
        fullOffset: () => {
            const rootRect = root().getBoundingClientRect()
            const frame = window.frameElement
            if (!frame) {
                return [rootRect.x, rootRect.y]
            }
            const frameRect = frame.getBoundingClientRect()
            return [rootRect.x + frameRect.x, rootRect.y + frameRect.y]
        },
    }
}

const RootContext = createContext<Root>()

interface Props {
    children: JSXElement
}

export const RootProvider = (props: Props) => {
    const root = createRoot()
    return (
        <RootContext.Provider value={root}>
            {props.children}
        </RootContext.Provider>
    )
}

export const useRoot = () => useContext(RootContext)
