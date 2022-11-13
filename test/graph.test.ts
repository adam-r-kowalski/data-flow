import { test, expect } from "vitest"

import { createGraph, Transform } from "../src/graph"
import { Vec2 } from "../src/vec2"

const position: Vec2 = [0, 0]

const schedule = () => {}

test("add an edge between two nodes", () => {
    const graph = createGraph(schedule)
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
    const graph = createGraph(schedule)
    const node = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node.outputs[0],
        input: node.inputs[0],
    })
    expect(edge).toBeUndefined()
})

test("disallow multiple edges between the same input and output", () => {
    const graph = createGraph(schedule)
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
    const graph = createGraph(schedule)
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

test("cycles between nodes are not allowed", () => {
    const graph = createGraph(schedule)
    const node0 = graph.addNode("add", position) as Transform
    const node1 = graph.addNode("add", position) as Transform
    const edge0 = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    expect(edge0).toEqual({
        id: edge0!.id,
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    const edge1 = graph.addEdge({
        output: node1.outputs[0],
        input: node0.inputs[0],
    })
    expect(edge1).toBeUndefined()
})

test("transforms where inputs don't have data don't run", () => {
    const graph = createGraph(schedule)
    const node0 = graph.addNode("add", position) as Transform
    const node1 = graph.addNode("add", position) as Transform
    const edge0 = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    expect(edge0).toEqual({
        id: edge0!.id,
        output: node0.outputs[0],
        input: node1.inputs[0],
    })
    const edge1 = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[1],
    })
    expect(edge1).toEqual({
        id: edge1!.id,
        output: node0.outputs[0],
        input: node1.inputs[1],
    })
})

test("delete a node with a connected output edge", () => {
    const graph = createGraph(schedule)
    const node0 = graph.addNode("number", position)
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteNode(node0.id)
    expect(graph.nodes[node0.id]).toBeUndefined()
    expect(graph.bodies[node0.body]).toBeUndefined()
    expect(graph.outputs[node0.outputs[0]]).toBeUndefined()
    expect(graph.edges[edge.id]).toBeUndefined()
    expect(graph.inputs[node1.inputs[0]].edge).toBeUndefined()
})

test("delete a node with a connected input edge", () => {
    const graph = createGraph(schedule)
    const node0 = graph.addNode("number", position)
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteNode(node1.id)
    expect(graph.nodes[node1.id]).toBeUndefined()
    expect(graph.bodies[node1.body]).toBeUndefined()
    expect(graph.outputs[node1.outputs[0]]).toBeUndefined()
    expect(graph.edges[edge.id]).toBeUndefined()
    expect(graph.outputs[node0.outputs[0]].edges).toEqual([])
})

test("delete an input edge", () => {
    const graph = createGraph(schedule)
    const node0 = graph.addNode("number", position)
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteInputEdge(node1.inputs[0])
    expect(graph.edges[edge.id]).toBeUndefined()
    expect(graph.inputs[edge.input].edge).toBeUndefined()
    expect(graph.outputs[edge.output].edges).toEqual([])
})
