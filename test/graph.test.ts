import { test, expect } from "vitest"
import * as fc from "fast-check"

import { createGraph, Transform } from "../src/Graph"
import { Sink, Source } from "../src/Graph/graph"
import { operations, TransformOperation } from "../src/operations"
import { Vec2 } from "../src/vec2"

const position: Vec2 = [0, 0]

test("add an edge between two nodes", () => {
    const graph = createGraph()
    const node0 = graph.addNode("num", position) as Source
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
    const node0 = graph.addNode("num", position) as Source
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
    const node0 = graph.addNode("num", position) as Source
    const node1 = graph.addNode("num", position) as Source
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
        const output = graph.database.outputs[node0.outputs[0]]
        expect(output.edges).toEqual([])
    }
    {
        const output = graph.database.outputs[node1.outputs[0]]
        expect(output.edges).toEqual([edge1!.id])
    }
    const input = graph.database.inputs[node2.inputs[0]]
    expect(input.edge).toEqual(edge1!.id)
    expect(graph.database.edges[edge0!.id]).toBeUndefined()
})

test("cycles between nodes are not allowed", () => {
    const graph = createGraph()
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
    const graph = createGraph()
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
    const graph = createGraph()
    const node0 = graph.addNode("num", position) as Source
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteNode(node0.id)
    expect(graph.database.nodes[node0.id]).toBeUndefined()
    expect(graph.database.bodies[node0.body]).toBeUndefined()
    expect(graph.database.outputs[node0.outputs[0]]).toBeUndefined()
    expect(graph.database.edges[edge.id]).toBeUndefined()
    expect(graph.database.inputs[node1.inputs[0]].edge).toBeUndefined()
})

test("delete a node with a connected input edge", () => {
    const graph = createGraph()
    const node0 = graph.addNode("num", position) as Source
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteNode(node1.id)
    expect(graph.database.nodes[node1.id]).toBeUndefined()
    expect(graph.database.bodies[node1.body]).toBeUndefined()
    expect(graph.database.outputs[node1.outputs[0]]).toBeUndefined()
    expect(graph.database.edges[edge.id]).toBeUndefined()
    expect(graph.database.outputs[node0.outputs[0]].edges).toEqual([])
})

test("delete input edge", () => {
    const graph = createGraph()
    const node0 = graph.addNode("num", position) as Source
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteInputEdge(node1.inputs[0])
    expect(graph.database.edges[edge.id]).toBeUndefined()
    expect(graph.database.inputs[edge.input].edge).toBeUndefined()
    expect(graph.database.outputs[edge.output].edges).toEqual([])
})

test("delete output edges", () => {
    const graph = createGraph()
    const node0 = graph.addNode("num", position) as Source
    const node1 = graph.addNode("add", position) as Transform
    const edge = graph.addEdge({
        output: node0.outputs[0],
        input: node1.inputs[0],
    })!
    graph.deleteOutputEdges(node0.outputs[0])
    expect(graph.database.edges[edge.id]).toBeUndefined()
    expect(graph.database.inputs[edge.input].edge).toBeUndefined()
    expect(graph.database.outputs[edge.output].edges).toEqual([])
})

test("replace a node", () => {
    const graph = createGraph()
    const node0 = graph.addNode("num", position) as Source
    const node2 = graph.addNode("add", position) as Transform
    graph.addEdge({
        output: node0.outputs[0],
        input: node2.inputs[0],
    })!
    graph.replaceNode(node2.id, "sub")
    expect(graph.database.nodes[node2.id]).toEqual({
        ...node2,
        name: "sub",
        func: (operations.sub as TransformOperation).func,
    })
})

test("add label then read node", () => {
    fc.assert(
        fc.property(
            fc
                .string()
                .filter(
                    (x) => !["valueOf", "toString", "__proto__"].includes(x)
                ),
            fc.integer(),
            (name, data) => {
                const graph = createGraph()
                const num = graph.addNode("num", position) as Source
                graph.setValue(num.body, { type: "Number", data })
                const label = graph.addNode("label", position) as Sink
                graph.setValue(label.body, { type: "Label", name })
                graph.addEdge({
                    output: num.outputs[0],
                    input: label.inputs[0],
                })
                const read = graph.addNode("read", position) as Source
                graph.setValue(read.body, { type: "Read", name })
                const id = graph.addNode("id", position) as Transform
                graph.addEdge({ output: read.outputs[0], input: id.inputs[0] })
                const body = graph.database.bodies[id.body]
                expect(body.value).toEqual({ type: "Number", data })
            }
        )
    )
})

test("delete label deletes edge", () => {
    const graph = createGraph()
    const num = graph.addNode("num", position) as Source
    const label = graph.addNode("label", position) as Sink
    const edge = graph.addEdge({
        output: num.outputs[0],
        input: label.inputs[0],
    })
    expect(edge).toEqual({
        id: edge!.id,
        output: num.outputs[0],
        input: label.inputs[0],
    })
    graph.deleteNode(label.id)
    expect(graph.database.edges[edge!.id]).toBeUndefined()
})
