import { test, expect } from "vitest"

import { createGraph, Transform } from "../src/graph"
import { Vec2 } from "../src/vec2"

const position: Vec2 = [0, 0]

test("add an edge between two nodes", () => {
    const graph = createGraph()
    const node0 = graph.addNode("number", position)
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    expect(edge).toEqual({
        id: edge!.id,
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
})

test("disallow edges between inputs and outputs of same node", () => {
    const graph = createGraph()
    const node = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node.outputs[0],
        input: node.inputs[0],
    })
    expect(edge).toBeUndefined()
})

test("disallow multiple edges between the same input and output", () => {
    const graph = createGraph()
    const node0 = graph.addNode("number", position)
    const node1 = graph.addNode("add", position) as Transform
    graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    expect(edge).toBeUndefined()
})

test("connecting a new output to an input replaces the old output", () => {
    const graph = createGraph()
    const node0 = graph.addNode("number", position)
    const node1 = graph.addNode("number", position)
    const node2 = graph.addNode("add", position) as Transform
    const edge0 = graph.addEdge({
        output: node0.outputs[0],
        input: node2.inputs[0],
    })
    const edge1 = graph.addEdge({
        output: node1.outputs[0],
        input: node2.inputs[0],
    })
    expect(edge1).toEqual({
        id: edge1!.id,
        output: node1.outputs[0],
        input: node2.inputs[0],
    })
    {
        const output = graph.outputs[node0.outputs[0]]
        expect(output.edges).toEqual([])
    }
    {
        const output = graph.outputs[node1.outputs[0]]
        expect(output.edges).toEqual([edge1!.id])
    }
    const input = graph.inputs[node2.inputs[0]]
    expect(input.edge).toEqual(edge1!.id)
    expect(graph.edges[edge0!.id]).toBeUndefined()
})
