import { createContext, createSignal, JSXElement, useContext } from "solid-js"
import { Vec2 } from "./vec2"

interface Context {
    setRoot: (el: HTMLElement) => void
    fullOffset: () => Vec2
    offset: () => Vec2
}

const RootContext = createContext<Context>()

interface Props {
    children: JSXElement
}

export const RootProvider = (props: Props) => {
    const [root, setRoot] = createSignal<HTMLElement>(document.body)
    const fullOffset = (): Vec2 => {
        const rootRect = root().getBoundingClientRect()
        const frame = window.frameElement
        if (!frame) {
            return [rootRect.x, rootRect.y]
        }
        const frameRect = frame.getBoundingClientRect()
        return [rootRect.x + frameRect.x, rootRect.y + frameRect.y]
    }
    const offset = (): Vec2 => {
        const rect = root().getBoundingClientRect()
        return [rect.x, rect.y]
    }
    const context: Context = { setRoot, fullOffset, offset }
    return (
        <RootContext.Provider value={context}>
            {props.children}
        </RootContext.Provider>
    )
}

export const useRoot = () => useContext(RootContext)
