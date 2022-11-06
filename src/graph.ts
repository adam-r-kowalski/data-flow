import { createStore } from "solid-js/store"

import { add, scale, Vec2 } from "./vec2"

export type ID = string

export interface Node {
    id: ID
    name: string
    position: Vec2
    inputs: ID[]
    outputs: ID[]
    body: ID
}

export interface Input {
    id: ID
    name: string
}

export interface Output {
    id: ID
    name: string
}

export interface Body {
    id: ID
    value: number
}

export interface Edge {
    id: ID
    input: ID
    output: ID
}

export type Nodes = { [id: ID]: Node }
export type Edges = { [id: ID]: Edge }
export type Inputs = { [id: ID]: Input }
export type Outputs = { [id: ID]: Output }
export type Bodies = { [id: ID]: Body }

export interface Graph {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
    outputs: Outputs
    bodies: Bodies
    dragNode: (id: ID, delta: Vec2, zoom: number) => void
}

export const createGraph = (n: number): Graph => {
    const initialNodes: Nodes = {}
    const initialEdges: Edges = {}
    const initialInputs: Inputs = {}
    const initialOutputs: Outputs = {}
    const initialBodies: Bodies = {}
    for (let i = 0; i < n; i += 3) {
        const x = Math.random() * 10000 - 5000
        const y = Math.random() * 10000 - 5000
        initialNodes[`node-${i}`] = {
            id: `node-${i}`,
            name: "num",
            position: [x, y],
            inputs: [],
            outputs: [`node-${i}_output-0`],
            body: `node-${i}_body`,
        }
        initialNodes[`node-${i + 1}`] = {
            id: `node-${i + 1}`,
            name: "num",
            position: [x, y + 200],
            inputs: [],
            outputs: [`node-${i + 1}_output-0`],
            body: `node-${i + 1}_body`,
        }
        initialNodes[`node-${i + 2}`] = {
            id: `node-${i + 2}`,
            name: "add",
            position: [x + 600, y + 100],
            inputs: [`node-${i + 2}_input-0`, `node-${i + 2}_input-1`],
            outputs: [`node-${i + 2}_output-0`],
            body: `node-${i + 2}_body`,
        }
        initialEdges[`edge-${i}`] = {
            id: `edge-${i}`,
            input: `node-${i + 2}_input-0`,
            output: `node-${i}_output-0`,
        }
        initialEdges[`edge-${i + 1}`] = {
            id: `edge-${i + 1}`,
            input: `node-${i + 2}_input-1`,
            output: `node-${i + 1}_output-0`,
        }
        initialInputs[`node-${i + 2}_input-0`] = {
            id: `node-${i + 2}_input-0`,
            name: "x",
        }
        initialInputs[`node-${i + 2}_input-1`] = {
            id: `node-${i + 2}_input-1`,
            name: "y",
        }
        initialOutputs[`node-${i}_output-0`] = {
            id: `node-${i}_output-0`,
            name: "out",
        }
        initialOutputs[`node-${i + 1}_output-0`] = {
            id: `node-${i + 1}_output-0`,
            name: "out",
        }
        initialOutputs[`node-${i + 2}_output-0`] = {
            id: `node-${i + 2}_output-0`,
            name: "out",
        }
        initialBodies[`node-${i}_body`] = {
            id: `node-${i}_body`,
            value: 18,
        }
        initialBodies[`node-${i + 1}_body`] = {
            id: `node-${i + 1}_body`,
            value: 24,
        }
        initialBodies[`node-${i + 2}_body`] = {
            id: `node-${i + 2}_body`,
            value: 42,
        }
    }
    const [graph, setGraph] = createStore({
        nodes: initialNodes,
        edges: initialEdges,
        inputs: initialInputs,
        outputs: initialOutputs,
        bodies: initialBodies,
    })
    return {
        nodes: graph.nodes,
        edges: graph.edges,
        inputs: graph.inputs,
        outputs: graph.outputs,
        bodies: graph.bodies,
        dragNode: (id: ID, delta: Vec2, zoom: number) => {
            setGraph("nodes", id, "position", (p) =>
                add(p, scale(delta, 1 / zoom))
            )
        },
    }
}
