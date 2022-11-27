import * as fc from "fast-check"

import { createGraph } from "../src/Graph"
import { Vec2 } from "../src/vec2"

const position: Vec2 = [0, 0]

test("add num to graph", () => {
    fc.assert(
        fc.property(fc.integer(), (data) => {
            const graph = createGraph()
            const node = graph.addNode({ type: "num", data }, position)
            expect(node).toEqual({
                id: node.id,
                self: { type: "num", data },
                position,
                inputs: [],
                output: {
                    value: { type: "num", data },
                    edges: [],
                },
            })
        })
    )
})

test("add call to graph", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "call", name: "add" }, position)
    expect(node).toEqual({
        id: node.id,
        self: { type: "call", name: "add" },
        position,
        inputs: node.inputs,
        output: {
            value: { type: "none" },
            edges: [],
        },
    })
    expect(node.inputs).toHaveLength(2)
    const [x, y] = node.inputs.map((input) => graph.database.inputs[input])
    expect(x).toEqual({ id: x.id, name: "", node: node.id })
    expect(y).toEqual({ id: y.id, name: "", node: node.id })
})

test("add an edge between two nodes", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "num", data: 0 }, position)
    const node1 = graph.addNode({ type: "call", name: "add" }, position)
    const edge = graph.addEdge({
        node: node0.id,
        input: node1.inputs[0],
    })
    expect(edge).toEqual({
        id: edge!.id,
        node: node0.id,
        input: node1.inputs[0],
    })
})

test("add both edges of a function calls it", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "num", data: 2 }, position)
    const node1 = graph.addNode({ type: "num", data: 3 }, position)
    const node2 = graph.addNode({ type: "call", name: "add" }, position)
    const edge0 = graph.addEdge({
        node: node0.id,
        input: node2.inputs[0],
    })
    const edge1 = graph.addEdge({
        node: node1.id,
        input: node2.inputs[1],
    })
    expect(edge0).toEqual({
        id: edge0!.id,
        node: node0.id,
        input: node2.inputs[0],
    })
    expect(edge1).toEqual({
        id: edge1!.id,
        node: node1.id,
        input: node2.inputs[1],
    })
    const value = graph.database.nodes[node2.id].output.value
    expect(value).toEqual({
        type: "tensor",
        data: 5,
        size: 1,
        shape: [],
        rank: 0,
        dtype: "float32",
    })
})

test("disallow edges between inputs and outputs of same node", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "call", name: "add" }, position)
    const edge = graph.addEdge({
        node: node.id,
        input: node.inputs[0],
    })
    expect(edge).toBeUndefined()
})

test("disallow multiple edges between the same input and output", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "num", data: 0 }, position)
    const node1 = graph.addNode({ type: "call", name: "add" }, position)
    graph.addEdge({
        node: node0.id,
        input: node1.inputs[0],
    })
    const edge = graph.addEdge({
        node: node0.id,
        input: node1.inputs[0],
    })
    expect(edge).toBeUndefined()
})

test("connecting a new output to an input replaces the old output", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "num", data: 0 }, position)
    const node1 = graph.addNode({ type: "num", data: 0 }, position)
    const node2 = graph.addNode({ type: "call", name: "add" }, position)
    const edge0 = graph.addEdge({
        node: node0.id,
        input: node2.inputs[0],
    })
    const edge1 = graph.addEdge({
        node: node1.id,
        input: node2.inputs[0],
    })
    expect(edge1).toEqual({
        id: edge1!.id,
        node: node1.id,
        input: node2.inputs[0],
    })
    {
        const output = graph.database.nodes[node0.id].output
        expect(output.edges).toEqual([])
    }
    {
        const output = graph.database.nodes[node1.id].output
        expect(output.edges).toEqual([edge1!.id])
    }
    const input = graph.database.inputs[node2.inputs[0]]
    expect(input.edge).toEqual(edge1!.id)
    expect(graph.database.edges[edge0!.id]).toBeUndefined()
})

test("cycles between nodes are not allowed", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "call", name: "add" }, position)
    const node1 = graph.addNode({ type: "call", name: "add" }, position)
    const edge0 = graph.addEdge({
        node: node0.id,
        input: node1.inputs[0],
    })
    expect(edge0).toEqual({
        id: edge0!.id,
        node: node0.id,
        input: node1.inputs[0],
    })
    const edge1 = graph.addEdge({
        node: node1.id,
        input: node0.inputs[0],
    })
    expect(edge1).toBeUndefined()
})

test("transforms where inputs don't have data don't run", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "call", name: "add" }, position)
    const node1 = graph.addNode({ type: "call", name: "add" }, position)
    const edge0 = graph.addEdge({
        node: node0.id,
        input: node1.inputs[0],
    })
    expect(edge0).toEqual({
        id: edge0!.id,
        node: node0.id,
        input: node1.inputs[0],
    })
    const edge1 = graph.addEdge({
        node: node0.id,
        input: node1.inputs[1],
    })
    expect(edge1).toEqual({
        id: edge1!.id,
        node: node0.id,
        input: node1.inputs[1],
    })
})

test("delete a node with a connected output edge", () => {
    const graph = createGraph()
    const node0 = graph.addNode({ type: "num", data: 0 }, position)
    const node1 = graph.addNode({ type: "call", name: "add" }, position)
    const edge = graph.addEdge({
        node: node0.id,
        input: node1.inputs[0],
    })!
    graph.deleteNode(node0.id)
    expect(graph.database.nodes[node0.id]).toBeUndefined()
    expect(graph.database.edges[edge.id]).toBeUndefined()
    expect(graph.database.inputs[node1.inputs[0]].edge).toBeUndefined()
})

// test("delete a node with a connected input edge", () => {
//     const graph = createGraph()
//     const node0 = graph.addNode("num", position) as Source
//     const node1 = graph.addNode("add", position) as Transform
//     const edge = graph.addEdge({
//         output: node0.outputs[0],
//         input: node1.inputs[0],
//     })!
//     graph.deleteNode(node1.id)
//     expect(graph.database.nodes[node1.id]).toBeUndefined()
//     expect(graph.database.bodies[node1.body]).toBeUndefined()
//     expect(graph.database.outputs[node1.outputs[0]]).toBeUndefined()
//     expect(graph.database.edges[edge.id]).toBeUndefined()
//     expect(graph.database.outputs[node0.outputs[0]].edges).toEqual([])
// })
//
// test("delete input edge", () => {
//     const graph = createGraph()
//     const node0 = graph.addNode("num", position) as Source
//     const node1 = graph.addNode("add", position) as Transform
//     const edge = graph.addEdge({
//         output: node0.outputs[0],
//         input: node1.inputs[0],
//     })!
//     graph.deleteInputEdge(node1.inputs[0])
//     expect(graph.database.edges[edge.id]).toBeUndefined()
//     expect(graph.database.inputs[edge.input].edge).toBeUndefined()
//     expect(graph.database.outputs[edge.output].edges).toEqual([])
// })
//
// test("delete output edges", () => {
//     const graph = createGraph()
//     const node0 = graph.addNode("num", position) as Source
//     const node1 = graph.addNode("add", position) as Transform
//     const edge = graph.addEdge({
//         output: node0.outputs[0],
//         input: node1.inputs[0],
//     })!
//     graph.deleteOutputEdges(node0.outputs[0])
//     expect(graph.database.edges[edge.id]).toBeUndefined()
//     expect(graph.database.inputs[edge.input].edge).toBeUndefined()
//     expect(graph.database.outputs[edge.output].edges).toEqual([])
// })
//
// test("replace a node", () => {
//     const graph = createGraph()
//     const node0 = graph.addNode("num", position) as Source
//     const node2 = graph.addNode("add", position) as Transform
//     graph.addEdge({
//         output: node0.outputs[0],
//         input: node2.inputs[0],
//     })!
//     graph.replaceNode(node2.id, "sub")
//     expect(graph.database.nodes[node2.id]).toEqual({
//         ...node2,
//         name: "sub",
//         func: (operations.sub as TransformOperation).func,
//     })
// })
//
// test("add label then read node", () => {
//     fc.assert(
//         fc.property(
//             fc
//                 .string()
//                 .filter(
//                     (x) => !["valueOf", "toString", "__proto__"].includes(x)
//                 ),
//             fc.integer(),
//             (name, data) => {
//                 const graph = createGraph()
//                 const num = graph.addNode("num", position) as Source
//                 graph.setValue(num.body, { type: "Number", data })
//                 const label = graph.addNode("label", position) as Sink
//                 graph.setValue(label.body, { type: "Label", name })
//                 graph.addEdge({
//                     output: num.outputs[0],
//                     input: label.inputs[0],
//                 })
//                 const read = graph.addNode("read", position) as Source
//                 graph.setValue(read.body, { type: "Read", name })
//                 const id = graph.addNode("id", position) as Transform
//                 graph.addEdge({ output: read.outputs[0], input: id.inputs[0] })
//                 const body = graph.database.bodies[id.body]
//                 expect(body.value).toEqual({ type: "Number", data })
//             }
//         )
//     )
// })
//
// test("delete label deletes edge", () => {
//     const graph = createGraph()
//     const num = graph.addNode("num", position) as Source
//     const label = graph.addNode("label", position) as Sink
//     const edge = graph.addEdge({
//         output: num.outputs[0],
//         input: label.inputs[0],
//     })
//     expect(edge).toEqual({
//         id: edge!.id,
//         output: num.outputs[0],
//         input: label.inputs[0],
//     })
//     graph.deleteNode(label.id)
//     expect(graph.database.edges[edge!.id]).toBeUndefined()
// })
