import { render, fireEvent } from "@solidjs/testing-library"
import { JSXElement } from "solid-js"
import { vi } from "vitest"
import * as fc from "fast-check"

import { GraphProvider } from "../src/Graph"
import { createGraph, Graph, UUID } from "../src/Graph/graph"
import { BodyContent } from "../src/Graph/NodeCards/BodyContent"
import { PositionsContext } from "../src/Graph/positions"
import { MeasureTextContext } from "../src/MeasureText"

import { Vec2 } from "../src/vec2"
import { Arbitrary } from "fast-check"

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

const N = fc.integer({ min: -10000, max: 10000 })
const Pos: Arbitrary<Vec2> = fc.tuple(N, N)
const Name: Arbitrary<string> = fc.stringOf(fc.lorem(), { minLength: 1 })
const Names = (n: number): Arbitrary<string[]> =>
    fc.array(Name, { minLength: n, maxLength: n }).filter((names) => {
        const unique = new Set(names)
        return unique.size === names.length
    })

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
