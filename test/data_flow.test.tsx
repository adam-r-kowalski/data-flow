import { render, fireEvent } from "@solidjs/testing-library"

import { DataFlow } from "../src/DataFlow"
import { createGraph } from "../src/Graph"
import { Vec2 } from "../src/vec2"
import { MockMeasureTextProvider } from "./mocks"

const pos: Vec2 = [0, 0]

test("clicking an output and input creates an edge", () => {
    const graph = createGraph()
    const num = graph.addNode({ type: "num", data: 5 }, pos)
    const linspace = graph.addNode({ type: "call", name: "linspace" }, pos)
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    const output = queryByRole("button", { name: `output ${num.id}` })!
    expect(output).toBeInTheDocument()
    const input = queryByRole("button", {
        name: `input ${linspace.inputs[0]}`,
    })!
    expect(input).toBeInTheDocument()
    fireEvent.click(output)
    fireEvent.click(input)
    const outEdge = graph.database.nodes[num.id].output!.edges[0]
    const start = graph.database.nodes[linspace.id].inputs[0]
    const inEdge = graph.database.inputs[start].edge
    expect(outEdge).toBe(inEdge)
    const edge = queryByRole("link", { name: `edge ${outEdge}` })
    expect(edge).toBeInTheDocument()
    unmount()
})

test("connecting all inputs of a function calls it and updates its body", () => {
    const graph = createGraph()
    const a = graph.addNode({ type: "num", data: 2 }, pos)
    const b = graph.addNode({ type: "num", data: 3 }, pos)
    const add = graph.addNode({ type: "call", name: "add" }, pos)
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    const addBody = queryByRole("none", { name: `body ${add.id}` })
    expect(addBody).toBeInTheDocument()
    const aOutput = queryByRole("button", { name: `output ${a.id}` })!
    const bOutput = queryByRole("button", { name: `output ${b.id}` })!
    const addInput0 = queryByRole("button", { name: `input ${add.inputs[0]}` })!
    const addInput1 = queryByRole("button", { name: `input ${add.inputs[1]}` })!
    fireEvent.click(aOutput)
    fireEvent.click(addInput0)
    fireEvent.click(bOutput)
    fireEvent.click(addInput1)
    expect(addBody).not.toBeInTheDocument()
    const newAddBody = queryByRole("grid", { name: `body ${add.id}` })
    expect(newAddBody).toBeInTheDocument()
    expect(newAddBody).toHaveTextContent("5")
    unmount()
})
