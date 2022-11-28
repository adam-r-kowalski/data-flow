import { render, fireEvent } from "@solidjs/testing-library"
import { JSXElement } from "solid-js"
import { vi } from "vitest"

import { GraphProvider } from "../src/Graph"
import { createGraph, Graph, UUID } from "../src/Graph/graph"
import { BodyContent } from "../src/Graph/NodeCards/BodyContent"
import { PositionsContext } from "../src/Graph/positions"
import { MeasureTextContext } from "../src/MeasureText"
import { scaled } from "../src/value/show/plot/scaled"

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

interface Props {
    graph: Graph
    children: JSXElement
}

const Provider = (props: Props) => (
    <GraphProvider graph={props.graph}>
        <MockMeasureTextProvider>
            <MockPositionsProvider>{props.children}</MockPositionsProvider>
        </MockMeasureTextProvider>
    </GraphProvider>
)

const pos: Vec2 = [0, 0]

test("show error", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "error", message: "error message" }, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("note", options)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("error message")
    unmount()
})

test("show label and edit name", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "label", name: "x" }, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("button", options)!
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("x")
    fireEvent.click(container)
    expect(container).not.toBeInTheDocument()
    const input = queryByRole("textbox", options)!
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("x")
    fireEvent.input(input, { target: { value: "y" } })
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    const nextContainer = queryByRole("button", options)!
    expect(nextContainer).toBeInTheDocument()
    expect(nextContainer).toHaveTextContent("y")
    unmount()
})

test("show none", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "none" }, pos)
    const { unmount, queryByRole } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("none", options)
    expect(container).toBeInTheDocument()
    unmount()
})

test("show num and edit value", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "num", data: 5 }, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("button", options)!
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("5")
    fireEvent.click(container)
    expect(container).not.toBeInTheDocument()
    const input = queryByRole("spinbutton", options)!
    expect(input).toBeInTheDocument()
    fireEvent.input(input, { target: { value: 10 } })
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    const nextContainer = queryByRole("button", options)!
    expect(nextContainer).toBeInTheDocument()
    expect(nextContainer).toHaveTextContent("10")
    unmount()
})

test("show read and edit value", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "read", name: "x" }, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("button", options)!
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("x")
    fireEvent.click(container)
    expect(container).not.toBeInTheDocument()
    const input = queryByRole("textbox", options)!
    expect(input).toBeInTheDocument()
    fireEvent.input(input, { target: { value: "y" } })
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    const nextContainer = queryByRole("button", options)!
    expect(nextContainer).toBeInTheDocument()
    expect(nextContainer).toHaveTextContent("y")
    unmount()
})

test("show tensor", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const graph = createGraph()
    const node = graph.addNode(
        {
            type: "tensor",
            data,
            size: data.length,
            shape: [data.length],
            rank: 1,
            dtype: "float32",
        },
        pos
    )
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("grid", options)!
    expect(container).toBeInTheDocument()
    expect(container.children.length).toEqual(data.length)
    for (let i = 0; i < data.length; i++) {
        expect(container.children[i]).toHaveTextContent(data[i].toString())
    }
    unmount()
})

test("show call", () => {
    const graph = createGraph()
    const a = graph.addNode({ type: "num", data: 5 }, pos)
    const b = graph.addNode({ type: "num", data: 3 }, pos)
    const node = graph.addNode({ type: "call", name: "add" }, pos)
    graph.addEdge({ node: a.id, input: node.inputs[0] })
    graph.addEdge({ node: b.id, input: node.inputs[1] })
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("grid", options)!
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("8")
    unmount()
})

test("show scatter", () => {
    const graph = createGraph()
    const value = {
        type: "scatter",
        x: [1, 2, 3],
        y: [2, 4, 8],
        domain: [1, 3] as Vec2,
        range: [4, 12] as Vec2,
    }
    const node = graph.addNode(value, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("figure", options)!
    expect(container).toBeInTheDocument()
    expect(container.children.length).toEqual(3)
    const scaledX = scaled(value.x, value.domain, [10, 290])
    const scaledY = scaled(value.y, value.range, [10, 290])
    for (let i = 0; i < 3; i++) {
        const child = container.children[i]
        expect(child).toHaveAttribute("cx", scaledX[i].toString())
        expect(child).toHaveAttribute("cy", scaledY[i].toString())
    }
    unmount()
})

test("show line", () => {
    const graph = createGraph()
    const value = {
        type: "line",
        x: [1, 2, 3],
        y: [2, 4, 8],
        domain: [1, 3] as Vec2,
        range: [4, 12] as Vec2,
    }
    const node = graph.addNode(value, pos)
    const { queryByRole, unmount } = render(() => (
        <Provider graph={graph}>
            <BodyContent node={node} />
        </Provider>
    ))
    const options = { name: `body ${node.id}` }
    const container = queryByRole("figure", options)!
    expect(container).toBeInTheDocument()
    expect(container.children.length).toEqual(1)
    const scaledX = scaled(value.x, value.domain, [10, 290])
    const scaledY = scaled(value.y, value.range, [10, 290])
    const path = scaledX
        .map((x, i) => `${i == 0 ? "M" : "L"}${x},${scaledY[i]}`)
        .join("")
    expect(container.children[0]).toHaveAttribute("d", path)
    unmount()
})
