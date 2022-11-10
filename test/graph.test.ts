import { test, expect } from "vitest"

import { createGraph, Transform } from "../src/graph"

test("add an edge between two nodes", () => {
    const graph = createGraph()
    const node0 = graph.addNode("number", [0, 0])
    const node1 = graph.addNode("add", [0, 0]) as Transform
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
    const node = graph.addNode("add", [0, 0]) as Transform
    const edge = graph.addEdge({
        output: node.outputs[0],
        input: node.inputs[0],
    })
    expect(edge).toEqual(undefined)
})
