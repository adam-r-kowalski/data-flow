import { createContext, createSignal, JSXElement, useContext } from "solid-js"

interface Context {
    root: () => HTMLElement | undefined
    setRoot: (el: HTMLElement) => void
}

const RootContext = createContext<Context>()

interface Props {
    children: JSXElement
}

export const RootProvider = (props: Props) => {
    const [root, setRoot] = createSignal<HTMLElement | undefined>(undefined)
    const context: Context = { root, setRoot }
    return (
        <RootContext.Provider value={context}>
            {props.children}
        </RootContext.Provider>
    )
}

export const useRoot = () => useContext(RootContext)
