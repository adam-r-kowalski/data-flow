import {
    createContext,
    createEffect,
    createSignal,
    JSXElement,
    useContext,
} from "solid-js"
import { Graph, UUID } from "./graph"
import { useGraph } from "./GraphProvider"

type Selection = UUID | undefined

export interface Selected {
    input: () => Selection
    setInput: (id: UUID) => void
    output: () => Selection
    setOutput: (id: UUID) => void
    clear: () => void
}

export const createSelected = (graph: Graph): Selected => {
    const [input, setInput] = createSignal<Selection>()
    const [output, setOutput] = createSignal<Selection>()
    createEffect(() => {
        if (input() !== undefined && output() !== undefined) {
            graph.addEdge({ input: input()!, node: output()! })
            setInput(undefined)
            setOutput(undefined)
        }
    })
    return {
        input,
        setInput: (id: UUID) => {
            setInput(id)
        },
        output,
        setOutput: (id: UUID) => {
            setOutput(id)
        },
        clear: () => {
            setInput(undefined)
            setOutput(undefined)
        },
    }
}

const SelectedContext = createContext<Selected>()

interface Props {
    children: JSXElement
}

export const SelectedProvider = (props: Props) => {
    const graph = useGraph()!
    const selected = createSelected(graph)
    return (
        <SelectedContext.Provider value={selected}>
            {props.children}
        </SelectedContext.Provider>
    )
}

export const useSelected = () => useContext(SelectedContext)
