import { Vec2 } from "./graph/vec2"

export type UUID = string

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

export interface Output {
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
export type Outputs = { [id: UUID]: Output }
export type Bodies = { [id: UUID]: Body }

export interface Graph {
    nodes: Nodes
    edges: Edges
    inputs: Inputs
    outputs: Outputs
    bodies: Bodies
}

export const initial = (n: number): Graph => {
    const nodes: Nodes = {}
    const edges: Edges = {}
    const inputs: Inputs = {}
    const outputs: Outputs = {}
    const bodies: Bodies = {}
    for (let i = 0; i < n; i += 3) {
        const x = Math.random() * 3000 - 1500
        const y = Math.random() * 3000 - 1500
        nodes[`node-${i}`] = {
            id: `node-${i}`,
            name: "num",
            position: [x, y],
            inputs: [],
            outputs: [`node-${i}_output-0`],
            body: `node-${i}_body`,
        }
        nodes[`node-${i + 1}`] = {
            id: `node-${i + 1}`,
            name: "num",
            position: [x, y + 200],
            inputs: [],
            outputs: [`node-${i + 1}_output-0`],
            body: `node-${i + 1}_body`,
        }
        nodes[`node-${i + 2}`] = {
            id: `node-${i + 2}`,
            name: "add",
            position: [x + 300, y + 100],
            inputs: [`node-${i + 2}_input-0`, `node-${i + 2}_input-1`],
            outputs: [`node-${i + 2}_output-0`],
            body: `node-${i + 2}_body`,
        }
        edges[`edge-${i}`] = {
            id: `edge-${i}`,
            input: `node-${i + 2}_input-0`,
            output: `node-${i}_output-0`,
        }
        edges[`edge-${i + 1}`] = {
            id: `edge-${i + 1}`,
            input: `node-${i + 2}_input-1`,
            output: `node-${i + 1}_output-0`,
        }
        inputs[`node-${i + 2}_input-0`] = {
            id: `node-${i + 2}_input-0`,
            name: "x",
        }
        inputs[`node-${i + 2}_input-1`] = {
            id: `node-${i + 2}_input-1`,
            name: "y",
        }
        outputs[`node-${i}_output-0`] = {
            id: `node-${i}_output-0`,
            name: "out",
        }
        outputs[`node-${i + 1}_output-0`] = {
            id: `node-${i + 1}_output-0`,
            name: "out",
        }
        outputs[`node-${i + 2}_output-0`] = {
            id: `node-${i + 2}_output-0`,
            name: "out",
        }
        bodies[`node-${i}_body`] = {
            id: `node-${i}_body`,
            value: 18,
        }
        bodies[`node-${i + 1}_body`] = {
            id: `node-${i + 1}_body`,
            value: 24,
        }
        bodies[`node-${i + 2}_body`] = {
            id: `node-${i + 2}_body`,
            value: 42,
        }
    }
    return { nodes, edges, inputs, outputs, bodies }
}
