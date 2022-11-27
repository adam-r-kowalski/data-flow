import { createStore, produce, SetStoreFunction } from "solid-js/store"

import { add, scale, Vec2 } from "../vec2"
import { base, call, Value } from "../value"

export type UUID = number

export interface Input {
    id: UUID
    name: string
    node: UUID
    edge?: UUID
}

export interface Output {
    value: Value
    edges: UUID[]
}

export interface Node {
    id: UUID
    self: Value
    position: Vec2
    inputs: UUID[]
    output: Output
}

export interface Edge {
    id: UUID
    node: UUID
    input: UUID
}

export type Nodes = { [id: UUID]: Node }
export type Edges = { [id: UUID]: Edge }
export type Inputs = { [id: UUID]: Input }

export interface Between {
    input: UUID
    node: UUID
}

export interface Database {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
}

export interface Graph {
    database: Database
    dragNode: (nodeId: UUID, delta: Vec2, zoom: number) => void
    addNode: (value: Value, position: Vec2) => Node
    addEdge: (between: Between) => Edge | undefined
    setValue: (nodeId: UUID, value: Value) => void
    subscribe: (callback: (nodeId: UUID) => void) => void
    deleteNode: (nodeId: UUID) => void
    deleteInputEdge: (inputId: UUID) => void
    deleteOutputEdges: (nodeId: UUID) => void
    replaceNode: (nodeId: UUID, value: Value) => void
    untrackLabel: (nodeId: UUID, label: string) => void
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

const addNode = (context: Context, value: Value, position: Vec2): Node => {
    const { database, setDatabase, generateId, notifySubscribers } = context
    const nodeId = generateId()
    setDatabase(
        produce((database) => {
            const isCall = value.type === "call"
            const output: Output = {
                edges: [],
                value: isCall ? { type: "none" } : value,
            }
            const inputs: UUID[] = []
            const args = isCall ? base[value.name].inputs : []
            for (const name of args) {
                const id = generateId()
                database.inputs[id] = {
                    id,
                    name,
                    node: nodeId,
                }
                inputs.push(id)
            }
            const node: Node = {
                id: nodeId,
                self: value,
                position,
                inputs,
                output,
            }
            database.nodes[nodeId] = node
        })
    )
    notifySubscribers(nodeId)
    return database.nodes[nodeId]
}

const evaluateOutputs = (context: Context, node: Node) => {
    const { database } = context
    for (const edgeId of node.output.edges) {
        const edge = database.edges[edgeId]
        evaluate(context, database.inputs[edge.input].node)
    }
}

const evaluate = (context: Context, nodeId: UUID) => {
    const { database, setDatabase, notifySubscribers } = context
    const node = database.nodes[nodeId]
    if (node.inputs.length === 0) {
        return evaluateOutputs(context, node)
    }
    const values: Value[] = []
    for (const input of node.inputs) {
        const edgeId = database.inputs[input].edge
        if (edgeId) {
            const edge = database.edges[edgeId]
            const outputNode = database.nodes[edge.node]
            const value = outputNode.output.value
            if (value.type === "Read") {
                const label = context.labels[value.name]
                if (label) values.push(label)
            } else {
                values.push(value)
            }
        }
    }
    if (node.self.type === "call") {
        const value: Value =
            values.length === node.inputs.length
                ? call(base, node.self.name, values)
                : { type: "none" }
        setDatabase("nodes", nodeId, "output", "value", value)
        evaluateOutputs(context, node)
        notifySubscribers(node.id)
    }
    // } else if (node.kind === NodeKind.SINK) {
    //     call(base, node.func, values)
    //     const body = database.bodies[node.body]
    //     if (body.value.type === "Label") {
    //         if (values.length > 0) {
    //             context.labels[body.value.name] = values[0]
    //         } else {
    //             context.labels[body.value.name] = { type: "None" }
    //         }
    //         const readers = context.readers[body.value.name]
    //         if (!readers) return
    //         for (const reader of readers) {
    //             evaluate(context, reader)
    //         }
    //     }
    // }
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
        const outputNodes: Set<UUID> = new Set()
        for (const edgeId of node.output.edges) {
            const edge = database.edges[edgeId]
            outputNodes.add(database.inputs[edge.input].node)
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
    { input: inputId, node: nodeId }: Between
): Edge | undefined => {
    const { database, setDatabase, generateId } = context
    const input = database.inputs[inputId]
    const inputNode = input.node
    if (inputNode === nodeId) {
        return undefined
    }
    const inputEdge = input.edge ? database.edges[input.edge] : undefined
    if (inputEdge && inputEdge.node === nodeId) {
        return undefined
    }
    if (wouldContainCycle(context, nodeId, inputNode)) {
        return undefined
    }
    const edge: Edge = {
        id: generateId(),
        node: nodeId,
        input: inputId,
    }
    setDatabase(
        produce((database) => {
            if (inputEdge) {
                const output = database.nodes[inputEdge.node].output
                output.edges = output.edges.filter((id) => id !== inputEdge.id)
                delete database.edges[inputEdge.id]
            }
            database.edges[edge.id] = edge
            database.nodes[nodeId].output.edges.push(edge.id)
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
    if (body.value.type === "Read") {
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
            const inputEdges: UUID[] = []
            for (const input of node.inputs) {
                const edge = database.inputs[input].edge
                if (edge) inputEdges.push(edge)
                delete database.inputs[input]
            }
            const inputIds: UUID[] = []
            const outputIds: UUID[] = []
            for (const edge of node.output.edges) {
                const input = database.edges[edge].input
                nodesToEvaluate.push(database.inputs[input].node)
                inputIds.push(input)
                delete database.edges[edge]
            }
            for (const edge of inputEdges) {
                outputIds.push(database.edges[edge].node)
                delete database.edges[edge]
            }
            for (const input of inputIds) {
                database.inputs[input].edge = undefined
            }
            outputIds.forEach((outputId, i) => {
                const inputEdge = inputEdges[i]
                const output = database.nodes[outputId].output
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
            const output = database.nodes[database.edges[edgeId].node].output
            output.edges = output.edges.filter((e) => e !== edgeId)
            delete database.edges[edgeId]
            database.inputs[inputId].edge = undefined
        })
    )
    evaluate(context, input.node)
}

const deleteOutputEdges = (context: Context, nodeId: UUID) => {
    const { setDatabase } = context
    const nodesToEvaluate: UUID[] = []
    setDatabase(
        produce((database) => {
            const output = database.nodes[nodeId].output
            for (const edgeId of output.edges) {
                nodesToEvaluate.push(
                    database.inputs[database.edges[edgeId].input].node
                )
                const edge = database.edges[edgeId]
                database.inputs[edge.input].edge = undefined
                delete database.edges[edgeId]
            }
            output.edges = []
        })
    )
    for (const node of nodesToEvaluate) {
        evaluate(context, node)
    }
}

const replaceNode = (context: Context, nodeId: UUID, value: Value) => {
    const { setDatabase } = context
    if (value.type !== "call") return
    setDatabase(
        produce((database) => {
            const node = database.nodes[nodeId]
            if (node.self.type !== "call") return
            if (
                base[value.name].inputs.length !==
                base[node.self.name].inputs.length
            )
                return
            node.self = value
        })
    )
    evaluate(context, nodeId)
}

const untrackLabel = (context: Context, nodeId: UUID, label: string): void => {
    const readers = context.readers[label]
    if (!readers) return
    readers.delete(nodeId)
}

export const createGraph = (): Graph => {
    const [database, setDatabase] = createStore<Database>({
        nodes: {},
        edges: {},
        inputs: {},
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
        untrackLabel: untrackLabel.bind(null, context),
    }
    return graph
}
