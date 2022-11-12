import { createEffect, createSignal } from "solid-js"
import { Graph, UUID } from "./graph"

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
        if (input() && output()) {
            graph.addEdge({ input: input()!, output: output()! })
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
