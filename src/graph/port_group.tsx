import { createContext, createSignal, JSXElement, useContext } from "solid-js"

interface Context {
    portIds: () => Set<string>
    addPortId: (id: string) => void
}

const PortGroupContext = createContext<Context>()

interface Props {
    children: JSXElement
}

export const PortGroupProvider = (props: Props) => {
    const [portIds, setPortIds] = createSignal<Set<string>>(new Set())
    const addPortId = (port: string) => setPortIds((ids) => ids.add(port))
    return (
        <PortGroupContext.Provider value={{ portIds, addPortId }}>
            {props.children}
        </PortGroupContext.Provider>
    )
}

export const usePortGroup = () => useContext(PortGroupContext)
