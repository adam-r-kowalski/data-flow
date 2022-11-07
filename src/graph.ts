import { createStore } from "solid-js/store"

import { add, scale, Vec2 } from "./vec2"
import { OperationKind, operations } from "./operations"
import { batch } from "solid-js"

export type UUID = number

export interface Node {
    id: UUID
    name: string
    position: Vec2
    inputs: UUID[]
    outputs: UUID[]
    body: UUID
}

export interface Input {
    id: UUID
    name: string
}

export interface Input {
    id: UUID
    name: string
}

export interface Body {
    id: UUID
    value: number
}

export interface Edge {
    id: UUID
    input: UUID
    output: UUID
}

export type Nodes = { [id: UUID]: Node }
export type Edges = { [id: UUID]: Edge }
export type Inputs = { [id: UUID]: Input }
export type Outputs = { [id: UUID]: Input }
export type Bodies = { [id: UUID]: Body }

export interface Graph {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
    outputs: Outputs
    bodies: Bodies
    dragNode: (id: UUID, delta: Vec2, zoom: number) => void
    addNode: (name: string, position: Vec2) => Node
    addEdge: (input: UUID, output: UUID) => Edge
}

export const createGraph = (): Graph => {
    const [nodes, setNodes] = createStore<Nodes>({})
    const [edges, setEdges] = createStore<Edges>({})
    const [inputs, setInputs] = createStore<Inputs>({})
    const [outputs, setOutputs] = createStore<Outputs>({})
    const [bodies, setBodies] = createStore<Bodies>({})
    let nextId: UUID = 0
    const generateId = (): UUID => nextId++
    const graph: Graph = {
        nodes,
        edges,
        inputs,
        outputs,
        bodies,
        dragNode: (id: UUID, delta: Vec2, zoom: number) => {
            setNodes(id, "position", (p) => add(p, scale(delta, 1 / zoom)))
        },
        addNode: (name: string, position: Vec2): Node =>
            batch(() => {
                const operation = operations[name]
                const inputs: UUID[] = []
                if (operation.kind === OperationKind.TRANSFORM) {
                    for (const name of operation.inputs) {
                        const input: Input = {
                            id: generateId(),
                            name,
                        }
                        setInputs(input.id, input)
                        inputs.push(input.id)
                    }
                }
                const outputs: UUID[] = []
                for (const name of operation.outputs) {
                    const output: Input = {
                        id: generateId(),
                        name,
                    }
                    setOutputs(output.id, output)
                    outputs.push(output.id)
                }
                const body: Body = {
                    id: generateId(),
                    value: 0,
                }
                setBodies(body.id, body)
                const node: Node = {
                    id: generateId(),
                    name,
                    position,
                    inputs,
                    outputs,
                    body: body.id,
                }
                setNodes(node.id, node)
                return node
            }),
        addEdge: (input: UUID, output: UUID): Edge => {
            const edge: Edge = {
                id: generateId(),
                input,
                output,
            }
            setEdges(edge.id, edge)
            return edge
        },
    }
    const node0 = graph.addNode("number", [50, 50])
    const node1 = graph.addNode("number", [50, 200])
    const node2 = graph.addNode("add", [300, 125])
    graph.addEdge(node0.outputs[0], node2.inputs[0])
    graph.addEdge(node1.outputs[0], node2.inputs[1])
    return graph
}
