import { createStore, produce } from "solid-js/store"

import { add, scale, Vec2 } from "./vec2"
import { Func, OperationKind, operations } from "./operations"
import { batch } from "solid-js"
import { Value, ValueKind } from "./value"

export type UUID = number

export enum NodeKind {
    SOURCE,
    TRANSFORM,
}

export interface Source {
    kind: NodeKind.SOURCE
    id: UUID
    name: string
    position: Vec2
    outputs: UUID[]
    body: UUID
}

export interface Transform {
    kind: NodeKind.TRANSFORM
    id: UUID
    name: string
    position: Vec2
    inputs: UUID[]
    outputs: UUID[]
    body: UUID
    func: Func
}

export type Node = Source | Transform

export interface Input {
    id: UUID
    name: string
    node: UUID
    edge?: UUID
}

export interface Output {
    id: UUID
    name: string
    node: UUID
    edges: UUID[]
}

export interface Body {
    id: UUID
    value: Value
    node: UUID
}

export interface Edge {
    id: UUID
    output: UUID
    input: UUID
}

export type Nodes = { [id: UUID]: Node }
export type Edges = { [id: UUID]: Edge }
export type Inputs = { [id: UUID]: Input }
export type Outputs = { [id: UUID]: Output }
export type Bodies = { [id: UUID]: Body }

interface Between {
    input: UUID
    output: UUID
}

export interface Graph {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
    outputs: Outputs
    bodies: Bodies
    dragNode: (nodeId: UUID, delta: Vec2, zoom: number) => void
    addNode: (name: string, position: Vec2) => Node
    addEdge: (between: Between) => Edge | undefined
    setValue: (bodyId: UUID, value: Value) => void
    subscribe: (callback: (nodeId: UUID) => void) => void
    deleteNode: (nodeId: UUID) => void
    deleteInputEdge: (inputId: UUID) => void
}

export const createGraph = (
    schedule: (callback: () => void) => void
): Graph => {
    const [nodes, setNodes] = createStore<Nodes>({})
    const [edges, setEdges] = createStore<Edges>({})
    const [inputs, setInputs] = createStore<Inputs>({})
    const [outputs, setOutputs] = createStore<Outputs>({})
    const [bodies, setBodies] = createStore<Bodies>({})
    let nextId: UUID = 0
    const generateId = (): UUID => nextId++
    let subscribers = new Set<(nodeId: UUID) => void>()
    const subscribe = (callback: (nodeId: UUID) => void): void => {
        subscribers.add(callback)
    }
    const notifySubscribers = (nodeId: UUID): void => {
        for (const subscriber of subscribers) {
            subscriber(nodeId)
        }
    }
    const dragNode = (nodeId: UUID, delta: Vec2, zoom: number) => {
        setNodes(nodeId, "position", (p) => add(p, scale(delta, 1 / zoom)))
        schedule(() => notifySubscribers(nodeId))
    }
    const addNode = (name: string, position: Vec2): Node => {
        const node = batch(() => {
            const operation = operations[name]
            const nodeId = generateId()
            const outputs: UUID[] = []
            for (const name of operation.outputs) {
                const output: Output = {
                    id: generateId(),
                    name,
                    node: nodeId,
                    edges: [],
                }
                setOutputs(output.id, output)
                outputs.push(output.id)
            }
            const body: Body = {
                id: generateId(),
                value:
                    operation.kind === OperationKind.SOURCE
                        ? { kind: ValueKind.NUMBER, value: operation.value }
                        : { kind: ValueKind.NONE },
                node: nodeId,
            }
            setBodies(body.id, body)
            const inputs: UUID[] = []
            if (operation.kind === OperationKind.TRANSFORM) {
                for (const name of operation.inputs) {
                    const input: Input = {
                        id: generateId(),
                        name,
                        node: nodeId,
                    }
                    setInputs(input.id, input)
                    inputs.push(input.id)
                }
                const node: Transform = {
                    kind: NodeKind.TRANSFORM,
                    id: nodeId,
                    name,
                    position,
                    inputs,
                    outputs,
                    body: body.id,
                    func: operation.func,
                }
                setNodes(node.id, node)
                return node
            } else {
                const node: Source = {
                    kind: NodeKind.SOURCE,
                    id: nodeId,
                    name,
                    position,
                    outputs,
                    body: body.id,
                }
                setNodes(node.id, node)
                return node
            }
        })
        schedule(() => notifySubscribers(node.id))
        return node
    }

    const evaluateOutputs = (node: Node) => {
        for (const output of node.outputs) {
            for (const edgeId of outputs[output].edges) {
                const edge = edges[edgeId]
                evaluate(inputs[edge.input].node)
            }
        }
    }
    const evaluate = (nodeId: UUID) => {
        const node = nodes[nodeId]
        if (node.kind === NodeKind.SOURCE) return evaluateOutputs(node)
        const values: Value[] = []
        for (const input of node.inputs) {
            const edgeId = inputs[input].edge
            if (edgeId) {
                const edge = edges[edgeId]
                const outputNode = nodes[outputs[edge.output].node]
                const outputBody = bodies[outputNode.body]
                values.push(outputBody.value)
            }
        }
        if (values.length === node.inputs.length) {
            const value = node.func(values)
            setBodies(node.body, "value", value)
            evaluateOutputs(node)
            schedule(() => notifySubscribers(node.id))
        } else {
            const value: Value = { kind: ValueKind.NONE }
            setBodies(node.body, "value", value)
            evaluateOutputs(node)
            schedule(() => notifySubscribers(node.id))
        }
    }
    const wouldContainCycle = (stop: UUID, start: UUID): boolean => {
        const visited = new Set([stop, start])
        const visit = (nodeId: UUID): boolean => {
            const node = nodes[nodeId]
            const outputNodes: Set<UUID> = new Set()
            for (const output of node.outputs) {
                for (const edgeId of outputs[output].edges) {
                    const edge = edges[edgeId]
                    outputNodes.add(inputs[edge.input].node)
                }
            }
            for (const output of outputNodes) {
                if (visited.has(output)) return true
                visited.add(output)
                if (visit(output)) return true
            }
            return false
        }
        return visit(start)
    }
    const addEdge = ({
        input: inputId,
        output: outputId,
    }: Between): Edge | undefined => {
        const input = inputs[inputId]
        const inputNode = input.node
        const output = outputs[outputId]
        const outputNode = output.node
        if (inputNode === outputNode) {
            return undefined
        }
        const inputEdge = input.edge ? edges[input.edge] : undefined
        if (inputEdge && inputEdge.output === outputId) {
            return undefined
        }
        if (wouldContainCycle(outputNode, inputNode)) {
            return undefined
        }
        const edge: Edge = {
            id: generateId(),
            output: outputId,
            input: inputId,
        }
        batch(() => {
            if (inputEdge) {
                setOutputs(inputEdge.output, "edges", (edges) =>
                    edges.filter((e) => e !== inputEdge.id)
                )
                setEdges(
                    produce((edges) => {
                        delete edges[inputEdge.id]
                    })
                )
            }
            setEdges(edge.id, edge)
            setOutputs(outputId, "edges", (edges) => [...edges, edge.id])
            setInputs(inputId, "edge", edge.id)
        })
        evaluate(inputNode)
        return edge
    }
    const setValue = (bodyId: UUID, value: Value) => {
        setBodies(bodyId, "value", value)
        const node = bodies[bodyId].node
        schedule(() => notifySubscribers(node))
        evaluate(node)
    }
    const deleteNode = (nodeId: UUID) => {
        const node = nodes[nodeId]
        batch(() => {
            setNodes(
                produce((nodes) => {
                    delete nodes[nodeId]
                })
            )
            setBodies(
                produce((bodies) => {
                    delete bodies[node.body]
                })
            )
            const outputEdges: UUID[] = []
            setOutputs(
                produce((outputs) => {
                    for (const output of node.outputs) {
                        outputEdges.push(...outputs[output].edges)
                        delete outputs[output]
                    }
                })
            )
            const inputEdges: UUID[] = []
            if (node.kind === NodeKind.TRANSFORM) {
                setInputs(
                    produce((inputs) => {
                        for (const input of node.inputs) {
                            const edge = inputs[input].edge
                            if (edge) inputEdges.push(edge)
                            delete inputs[input]
                        }
                    })
                )
            }
            const inputIds: UUID[] = []
            const outputIds: UUID[] = []
            const nodesToEvaluate: UUID[] = []
            setEdges(
                produce((edges) => {
                    for (const edge of outputEdges) {
                        const input = edges[edge].input
                        nodesToEvaluate.push(inputs[input].node)
                        inputIds.push(input)
                        delete edges[edge]
                    }
                    for (const edge of inputEdges) {
                        outputIds.push(edges[edge].output)
                        delete edges[edge]
                    }
                })
            )
            setInputs(
                produce((inputs) => {
                    for (const input of inputIds) {
                        inputs[input].edge = undefined
                    }
                })
            )
            setOutputs(
                produce((outputs) => {
                    outputIds.forEach((outputId, i) => {
                        const inputEdge = inputEdges[i]
                        const output = outputs[outputId]
                        output.edges = output.edges.filter(
                            (e) => e !== inputEdge
                        )
                    })
                })
            )
            for (const nodeId of nodesToEvaluate) {
                evaluate(nodeId)
            }
        })
    }
    const deleteInputEdge = (inputId: UUID) => {
        const input = inputs[inputId]
        const edgeId = input.edge
        if (!edgeId) return
        setOutputs(
            produce((outputs) => {
                const output = outputs[edges[edgeId].output]
                output.edges = output.edges.filter((e) => e !== edgeId)
            })
        )
        setEdges(produce((edges) => delete edges[edgeId]))
        setInputs(inputId, "edge", undefined)
    }
    const graph: Graph = {
        nodes,
        edges,
        inputs,
        outputs,
        bodies,
        dragNode,
        addNode,
        addEdge,
        setValue,
        subscribe,
        deleteNode,
        deleteInputEdge,
    }
    return graph
}
