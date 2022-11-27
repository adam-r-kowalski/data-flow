import { render, fireEvent } from "@solidjs/testing-library"
import { JSXElement } from "solid-js"
import { vi } from "vitest"

import { GraphProvider } from "../src/Graph"
import { createGraph, UUID } from "../src/Graph/graph"
import { BodyContent } from "../src/Graph/NodeCards/BodyContent"
import { PositionsContext } from "../src/Graph/positions"
import { MeasureTextContext } from "../src/MeasureText"

import { Vec2 } from "../src/vec2"

export const MockMeasureTextProvider = (props: { children: JSXElement }) => {
    const width = vi.fn<[string, string], number>(() => 0)
    return (
        <MeasureTextContext.Provider value={{ width }}>
            {props.children}
        </MeasureTextContext.Provider>
    )
}

export const MockPositionsProvider = (props: { children: JSXElement }) => {
    const positions = {
        track: vi.fn<[UUID, HTMLElement], void>(),
        position: vi.fn<[UUID], Vec2>(() => [0, 0]),
        retrack: vi.fn<[UUID], void>(),
    }
    return (
        <PositionsContext.Provider value={positions}>
            {props.children}
        </PositionsContext.Provider>
    )
}

test("show error", () => {
    const graph = createGraph()
    const error = { type: "error", message: "this is an error" }
    const node = graph.addNode(error, [0, 0])
    expect(node.self).toEqual(error)
    expect(node.self).toEqual(node.output!.value)
    const { queryByText, unmount } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={node} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    const container = queryByText(error.message)!
    expect(container).toBeInTheDocument()
    unmount()
})

test("show error after function call", () => {
    const graph = createGraph()
    const pos: Vec2 = [0, 0]
    const start = graph.addNode({ type: "num", data: -10 }, pos)
    const stop = graph.addNode({ type: "num", data: 10 }, pos)
    const num = graph.addNode({ type: "num", data: -10 }, pos)
    const linspace = graph.addNode({ type: "call", name: "linspace" }, pos)
    graph.addEdge({ input: linspace.inputs[0], node: start.id })
    graph.addEdge({ input: linspace.inputs[1], node: stop.id })
    graph.addEdge({ input: linspace.inputs[2], node: num.id })
    expect(linspace.self).toEqual({ type: "call", name: "linspace" })
    const message = "The number of values should be positive."
    expect(linspace.output!.value).toEqual({ type: "error", message })
    const { queryByText, unmount } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={linspace} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    const container = queryByText(message)!
    expect(container).toBeInTheDocument()
    unmount()
})

test("show label and edit name", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "label", name: "x" }, [0, 0])
    expect(node.self).toEqual({ type: "label", name: "x" })
    expect(node.output).toBeUndefined()
    const { queryByText, unmount, queryByDisplayValue } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={node} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    const container = queryByText("x")!
    expect(container).toBeInTheDocument()
    fireEvent.click(container)
    expect(container).not.toBeInTheDocument()
    const input = queryByDisplayValue("x")!
    expect(input).toBeInTheDocument()
    fireEvent.input(input, { target: { value: "y" } })
    const nextNode = graph.database.nodes[node.id]
    expect(nextNode.self).toEqual({ type: "label", name: "y" })
    expect(nextNode.output).toBeUndefined()
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    expect(queryByText("y")!).toBeInTheDocument()
    unmount()
})

test("show function with no inputs has none type", () => {
    const graph = createGraph()
    const pos: Vec2 = [0, 0]
    const linspace = graph.addNode({ type: "call", name: "linspace" }, pos)
    expect(linspace.self).toEqual({ type: "call", name: "linspace" })
    expect(linspace.output!.value).toEqual({ type: "none" })
    const { unmount, baseElement } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={linspace} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    expect(baseElement.children.length).toEqual(1)
    expect(baseElement.children[0]).toBeEmptyDOMElement()
    unmount()
})

test("show num and edit value", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "num", data: 0 }, [0, 0])
    expect(node.self).toEqual({ type: "num", data: 0 })
    expect(node.self).toEqual(node.output!.value)
    const { queryByRole, unmount } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={node} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    const name = `body ${node.id}`
    const container = queryByRole("button", { name })!
    expect(container).toBeInTheDocument()
    fireEvent.click(container)
    expect(container).not.toBeInTheDocument()
    const input = queryByRole("spinbutton", { name })!
    expect(input).toBeInTheDocument()
    fireEvent.input(input, { target: { value: 3 } })
    const nextNode = graph.database.nodes[node.id]
    expect(nextNode.self).toEqual({ type: "num", data: 3 })
    expect(nextNode.self).toEqual(nextNode.output!.value)
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    expect(queryByRole("button", { name })!).toBeInTheDocument()
    unmount()
})

test("show read and edit value", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "num", data: 0 }, [0, 0])
    expect(node.self).toEqual({ type: "num", data: 0 })
    expect(node.self).toEqual(node.output!.value)
    const { queryByText, unmount, queryByDisplayValue } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={node} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    const container = queryByText("0")!
    expect(container).toBeInTheDocument()
    fireEvent.click(container)
    expect(container).not.toBeInTheDocument()
    const input = queryByDisplayValue(0)!
    expect(input).toBeInTheDocument()
    fireEvent.input(input, { target: { value: 3 } })
    const nextNode = graph.database.nodes[node.id]
    expect(nextNode.self).toEqual({ type: "num", data: 3 })
    expect(nextNode.self).toEqual(nextNode.output!.value)
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    expect(queryByText("3")!).toBeInTheDocument()
    unmount()
})
