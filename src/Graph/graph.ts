import { createStore, produce, SetStoreFunction } from "solid-js/store"

import { add, scale, Vec2 } from "../vec2"
import {
    TransformFunc,
    SinkFunc,
    OperationKind,
    operations,
} from "../operations"
import { Value, ValueKind } from "./value"

export type UUID = number

export enum NodeKind {
    SOURCE,
    TRANSFORM,
    SINK,
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
    func: TransformFunc
}

export interface Sink {
    kind: NodeKind.SINK
    id: UUID
    name: string
    position: Vec2
    inputs: UUID[]
    body: UUID
    func: SinkFunc
}

export type Node = Source | Transform | Sink

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

export interface Between {
    input: UUID
    output: UUID
}

export interface Database {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
    outputs: Outputs
    bodies: Bodies
}

export interface Graph {
    database: Database
    dragNode: (nodeId: UUID, delta: Vec2, zoom: number) => void
    addNode: (name: string, position: Vec2) => Node
    addEdge: (between: Between) => Edge | undefined
    setValue: (bodyId: UUID, value: Value) => void
    subscribe: (callback: (nodeId: UUID) => void) => void
    deleteNode: (nodeId: UUID) => void
    deleteInputEdge: (inputId: UUID) => void
    deleteOutputEdges: (outputId: UUID) => void
    replaceNode: (nodeId: UUID, name: string) => void
}

type SetDatabase = SetStoreFunction<Database>

interface Context {
    database: Database
    setDatabase: SetDatabase
    notifySubscribers: (nodeId: UUID) => void
    generateId: () => UUID
    labels: { [name: string]: Value }
    readers: { [name: string]: Set<UUID> }
}

const dragNode = (
    context: Context,
    nodeId: UUID,
    delta: Vec2,
    zoom: number
) => {
    const { setDatabase, notifySubscribers } = context
    setDatabase("nodes", nodeId, "position", (p) =>
        add(p, scale(delta, 1 / zoom))
    )
    notifySubscribers(nodeId)
}

const addNode = (context: Context, name: string, position: Vec2): Node => {
    const { database, setDatabase, generateId, notifySubscribers } = context
    const nodeId = generateId()
    const operation = operations[name]
    setDatabase(
        produce((database) => {
            const outputs: UUID[] = []
            if (operation.kind !== OperationKind.SINK) {
                for (const name of operation.outputs) {
                    const output: Output = {
                        id: generateId(),
                        name,
                        node: nodeId,
                        edges: [],
                    }
                    database.outputs[output.id] = output
                    outputs.push(output.id)
                }
            }
            const value: Value = (() => {
                switch (operation.kind) {
                    case OperationKind.SOURCE:
                        switch (operation.name) {
                            case "num":
                                return { kind: ValueKind.NUMBER, value: 0 }
                            case "read":
                                return { kind: ValueKind.READ, name: "" }
                            default:
                                return { kind: ValueKind.NONE }
                        }
                    case OperationKind.TRANSFORM:
                        return { kind: ValueKind.NONE }
                    case OperationKind.SINK:
                        switch (operation.name) {
                            case "label":
                                return {
                                    kind: ValueKind.LABEL,
                                    name: "",
                                    value: { kind: ValueKind.NONE },
                                }
                            default:
                                return { kind: ValueKind.NONE }
                        }
                }
            })()
            const body: Body = {
                id: generateId(),
                value,
                node: nodeId,
            }
            database.bodies[body.id] = body
            const inputs: UUID[] = []
            if (operation.kind !== OperationKind.SOURCE) {
                for (const name of operation.inputs) {
                    const input: Input = {
                        id: generateId(),
                        name,
                        node: nodeId,
                    }
                    database.inputs[input.id] = input
                    inputs.push(input.id)
                }
            }
            if (operation.kind === OperationKind.SOURCE) {
                const node: Source = {
                    kind: NodeKind.SOURCE,
                    id: nodeId,
                    name,
                    position,
                    outputs,
                    body: body.id,
                }
                database.nodes[nodeId] = node
            } else if (operation.kind === OperationKind.TRANSFORM) {
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
                database.nodes[nodeId] = node
            } else {
                const node: Sink = {
                    kind: NodeKind.SINK,
                    id: nodeId,
                    name,
                    position,
                    inputs,
                    body: body.id,
                    func: operation.func,
                }
                database.nodes[nodeId] = node
            }
        })
    )
    notifySubscribers(nodeId)
    return database.nodes[nodeId]
}

const evaluateOutputs = (context: Context, node: Node) => {
    if (node.kind === NodeKind.SINK) return
    const { database } = context
    for (const output of node.outputs) {
        for (const edgeId of database.outputs[output].edges) {
            const edge = database.edges[edgeId]
            evaluate(context, database.inputs[edge.input].node)
        }
    }
}

const evaluate = (context: Context, nodeId: UUID) => {
    const { database, setDatabase, notifySubscribers } = context
    const node = database.nodes[nodeId]
    if (node.kind === NodeKind.SOURCE) {
        return evaluateOutputs(context, node)
    }
    const values: Value[] = []
    for (const input of node.inputs) {
        const edgeId = database.inputs[input].edge
        if (edgeId) {
            const edge = database.edges[edgeId]
            const outputNode =
                database.nodes[database.outputs[edge.output].node]
            const outputBody = database.bodies[outputNode.body]
            if (outputBody.value.kind === ValueKind.READ) {
                const label = context.labels[outputBody.value.name]
                values.push(label)
            } else {
                values.push(outputBody.value)
            }
        }
    }
    if (node.kind === NodeKind.TRANSFORM) {
        const value: Value =
            values.length === node.inputs.length
                ? node.func(values)
                : { kind: ValueKind.NONE }
        setDatabase("bodies", node.body, "value", value)
        evaluateOutputs(context, node)
        notifySubscribers(node.id)
    } else if (node.kind === NodeKind.SINK) {
        node.func(values)
        const body = database.bodies[node.body]
        if (body.value.kind === ValueKind.LABEL) {
            if (values.length > 0) {
                context.labels[body.value.name] = values[0]
            } else {
                context.labels[body.value.name] = { kind: ValueKind.NONE }
            }
            const readers = context.readers[body.value.name]
            if (!readers) return
            for (const reader of readers) {
                evaluate(context, reader)
            }
        }
    }
}

const wouldContainCycle = (
    context: Context,
    stop: UUID,
    start: UUID
): boolean => {
    const { database } = context
    const visited = new Set([stop, start])
    const visit = (nodeId: UUID): boolean => {
        const node = database.nodes[nodeId]
        if (node.kind === NodeKind.SINK) return false
        const outputNodes: Set<UUID> = new Set()
        for (const output of node.outputs) {
            for (const edgeId of database.outputs[output].edges) {
                const edge = database.edges[edgeId]
                outputNodes.add(database.inputs[edge.input].node)
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

const addEdge = (
    context: Context,
    { input: inputId, output: outputId }: Between
): Edge | undefined => {
    const { database, setDatabase, generateId } = context
    const input = database.inputs[inputId]
    const inputNode = input.node
    const output = database.outputs[outputId]
    const outputNode = output.node
    if (inputNode === outputNode) {
        return undefined
    }
    const inputEdge = input.edge ? database.edges[input.edge] : undefined
    if (inputEdge && inputEdge.output === outputId) {
        return undefined
    }
    if (wouldContainCycle(context, outputNode, inputNode)) {
        return undefined
    }
    const edge: Edge = {
        id: generateId(),
        output: outputId,
        input: inputId,
    }
    setDatabase(
        produce((database) => {
            if (inputEdge) {
                const output = database.outputs[inputEdge.output]
                output.edges = output.edges.filter((id) => id !== inputEdge.id)
                delete database.edges[inputEdge.id]
            }
            database.edges[edge.id] = edge
            database.outputs[outputId].edges.push(edge.id)
            database.inputs[inputId].edge = edge.id
        })
    )
    evaluate(context, inputNode)
    return edge
}

const setValue = (context: Context, bodyId: UUID, value: Value) => {
    const { database, setDatabase, notifySubscribers } = context
    setDatabase("bodies", bodyId, "value", value)
    const body = database.bodies[bodyId]
    if (body.value.kind === ValueKind.READ) {
        const readers = context.readers[body.value.name]
        if (readers) readers.add(body.node)
        else context.readers[body.value.name] = new Set([body.node])
    }
    notifySubscribers(body.node)
    evaluate(context, body.node)
}

const deleteNode = (context: Context, nodeId: UUID) => {
    const { database, setDatabase } = context
    const node = database.nodes[nodeId]
    const nodesToEvaluate: UUID[] = []
    setDatabase(
        produce((database) => {
            delete database.nodes[nodeId]
            delete database.bodies[node.body]
            const outputEdges: UUID[] = []
            if (node.kind !== NodeKind.SINK) {
                for (const output of node.outputs) {
                    outputEdges.push(...database.outputs[output].edges)
                    delete database.outputs[output]
                }
            }
            const inputEdges: UUID[] = []
            if (node.kind === NodeKind.TRANSFORM) {
                for (const input of node.inputs) {
                    const edge = database.inputs[input].edge
                    if (edge) inputEdges.push(edge)
                    delete database.inputs[input]
                }
            }
            const inputIds: UUID[] = []
            const outputIds: UUID[] = []
            for (const edge of outputEdges) {
                const input = database.edges[edge].input
                nodesToEvaluate.push(database.inputs[input].node)
                inputIds.push(input)
                delete database.edges[edge]
            }
            for (const edge of inputEdges) {
                outputIds.push(database.edges[edge].output)
                delete database.edges[edge]
            }
            for (const input of inputIds) {
                database.inputs[input].edge = undefined
            }
            outputIds.forEach((outputId, i) => {
                const inputEdge = inputEdges[i]
                const output = database.outputs[outputId]
                output.edges = output.edges.filter((e) => e !== inputEdge)
            })
        })
    )
    for (const nodeId of nodesToEvaluate) {
        evaluate(context, nodeId)
    }
}

const deleteInputEdge = (context: Context, inputId: UUID) => {
    const { database, setDatabase } = context
    const input = database.inputs[inputId]
    const edgeId = input.edge
    if (!edgeId) return
    setDatabase(
        produce((database) => {
            const output = database.outputs[database.edges[edgeId].output]
            output.edges = output.edges.filter((e) => e !== edgeId)
            delete database.edges[edgeId]
            database.inputs[inputId].edge = undefined
        })
    )
    evaluate(context, input.node)
}

const deleteOutputEdges = (context: Context, outputId: UUID) => {
    const { database, setDatabase } = context
    const output = database.outputs[outputId]
    const nodesToEvaluate: UUID[] = []
    setDatabase(
        produce((database) => {
            for (const edgeId of output.edges) {
                nodesToEvaluate.push(
                    database.inputs[database.edges[edgeId].input].node
                )
                const edge = database.edges[edgeId]
                database.inputs[edge.input].edge = undefined
                delete database.edges[edgeId]
            }
            database.outputs[outputId].edges = []
        })
    )
    for (const node of nodesToEvaluate) {
        evaluate(context, node)
    }
}

const replaceNode = (context: Context, nodeId: UUID, name: string) => {
    const { setDatabase } = context
    const operation = operations[name]
    if (operation.kind !== OperationKind.TRANSFORM) return
    setDatabase(
        produce((database) => {
            const node = database.nodes[nodeId]
            if (node.kind !== NodeKind.TRANSFORM) return
            if (operation.inputs.length !== node.inputs.length) return
            if (operation.outputs.length !== node.outputs.length) return
            node.name = name
            node.func = operation.func
        })
    )
    evaluate(context, nodeId)
}

export const createGraph = (): Graph => {
    const [database, setDatabase] = createStore<Database>({
        nodes: {},
        edges: {},
        inputs: {},
        outputs: {},
        bodies: {},
    })
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
    const context: Context = {
        database,
        setDatabase,
        notifySubscribers,
        generateId,
        labels: {},
        readers: {},
    }
    const graph: Graph = {
        database,
        subscribe,
        dragNode: dragNode.bind(null, context),
        addNode: addNode.bind(null, context),
        addEdge: addEdge.bind(null, context),
        setValue: setValue.bind(null, context),
        deleteNode: deleteNode.bind(null, context),
        deleteInputEdge: deleteInputEdge.bind(null, context),
        deleteOutputEdges: deleteOutputEdges.bind(null, context),
        replaceNode: replaceNode.bind(null, context),
    }
    return graph
}
