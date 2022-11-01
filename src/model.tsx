export type UUID = string

export interface Node {
    uuid: UUID
    name: string
    x: number
    y: number
    inputs: UUID[]
    outputs: UUID[]
    body: UUID
}

export interface Input {
    uuid: UUID
    name: string
}

export interface Output {
    uuid: UUID
    name: string
}

export interface Body {
    uuid: UUID
    value: number
}

export interface Edge {
    uuid: UUID
    input: UUID
    output: UUID
}

export type Nodes = { [uuid: UUID]: Node }
export type Edges = { [uuid: UUID]: Edge }
export type Inputs = { [uuid: UUID]: Input }
export type Outputs = { [uuid: UUID]: Output }
export type Bodies = { [uuid: UUID]: Body }

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
        const x = Math.random() * window.innerWidth
        const y = Math.random() * window.innerHeight
        nodes[`node-${i}`] = {
            uuid: `node-${i}`,
            name: "num",
            x,
            y,
            inputs: [],
            outputs: [`node-${i}_output-0`],
            body: `node-${i}_body`,
        }
        nodes[`node-${i + 1}`] = {
            uuid: `node-${i + 1}`,
            name: "num",
            x,
            y: y + 200,
            inputs: [],
            outputs: [`node-${i + 1}_output-0`],
            body: `node-${i + 1}_body`,
        }
        nodes[`node-${i + 2}`] = {
            uuid: `node-${i + 2}`,
            name: "add",
            x: x + 300,
            y: y + 100,
            inputs: [`node-${i + 2}_input-0`, `node-${i + 2}_input-1`],
            outputs: [`node-${i + 2}_output-0`],
            body: `node-${i + 2}_body`,
        }
        edges[`edge-${i}`] = {
            uuid: `edge-${i}`,
            input: `node-${i + 2}_input-0`,
            output: `node-${i}_output-0`,
        }
        edges[`edge-${i + 1}`] = {
            uuid: `edge-${i + 1}`,
            input: `node-${i + 2}_input-1`,
            output: `node-${i + 1}_output-0`,
        }
        inputs[`node-${i + 2}_input-0`] = {
            uuid: `node-${i + 2}_input-0`,
            name: "x",
        }
        inputs[`node-${i + 2}_input-1`] = {
            uuid: `node-${i + 2}_input-1`,
            name: "y",
        }
        outputs[`node-${i}_output-0`] = {
            uuid: `node-${i}_output-0`,
            name: "out",
        }
        outputs[`node-${i + 1}_output-0`] = {
            uuid: `node-${i + 1}_output-0`,
            name: "out",
        }
        outputs[`node-${i + 2}_output-0`] = {
            uuid: `node-${i + 2}_output-0`,
            name: "out",
        }
        bodies[`node-${i}_body`] = {
            uuid: `node-${i}_body`,
            value: 18,
        }
        bodies[`node-${i + 1}_body`] = {
            uuid: `node-${i + 1}_body`,
            value: 24,
        }
        bodies[`node-${i + 2}_body`] = {
            uuid: `node-${i + 2}_body`,
            value: 42,
        }
    }
    return { nodes, edges, inputs, outputs, bodies }
}
