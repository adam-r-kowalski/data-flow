import { render, fireEvent } from "@solidjs/testing-library"
import { JSXElement } from "solid-js"
import { vi } from "vitest"
import * as fc from "fast-check"

import { GraphProvider } from "../src/Graph"
import { createGraph, Graph, Node, UUID } from "../src/Graph/graph"
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

test("show error", () => {
    fc.assert(
        fc.property(Pos, fc.string(), (pos, message) => {
            const graph = createGraph()
            const node = graph.addNode({ type: "error", message }, pos)
            const { queryByRole, unmount } = render(() => (
                <Provider graph={graph}>
                    <BodyContent node={node} />
                </Provider>
            ))
            const options = { name: `body ${node.id}` }
            const container = queryByRole("note", options)
            expect(container).toBeInTheDocument()
            expect(container).toHaveTextContent(message.trim())
            unmount()
        })
    )
})

test("show label and edit name", () => {
    fc.assert(
        fc.property(Pos, Names(2), (pos, [name, newName]) => {
            const graph = createGraph()
            const node = graph.addNode({ type: "label", name }, pos)
            const { queryByRole, unmount } = render(() => (
                <Provider graph={graph}>
                    <BodyContent node={node} />
                </Provider>
            ))
            const options = { name: `body ${node.id}` }
            const container = queryByRole("button", options)!
            expect(container).toBeInTheDocument()
            expect(container).toHaveTextContent(name)
            fireEvent.click(container)
            expect(container).not.toBeInTheDocument()
            const input = queryByRole("textbox", options)!
            expect(input).toBeInTheDocument()
            expect(input).toHaveValue(name)
            fireEvent.input(input, { target: { value: newName } })
            fireEvent.blur(input)
            expect(input).not.toBeInTheDocument()
            const nextContainer = queryByRole("button", options)!
            expect(nextContainer).toBeInTheDocument()
            expect(nextContainer).toHaveTextContent(newName)
            unmount()
        })
    )
})

test("show none", () => {
    fc.assert(
        fc.property(Pos, (pos) => {
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
    )
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
    expect(container).toHaveTextContent("0")
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
    const nextContainer = queryByRole("button", { name })!
    expect(nextContainer).toBeInTheDocument()
    expect(nextContainer).toHaveTextContent("3")
    unmount()
})

test("show read and edit value", () => {
    const graph = createGraph()
    const node = graph.addNode({ type: "read", name: "x" }, [0, 0])
    expect(node.self).toEqual({ type: "read", name: "x" })
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
    const input = queryByRole("textbox", { name })!
    expect(input).toBeInTheDocument()
    fireEvent.input(input, { target: { value: "y" } })
    const nextNode = graph.database.nodes[node.id]
    expect(nextNode.self).toEqual({ type: "read", name: "y" })
    expect(nextNode.self).toEqual(nextNode.output!.value)
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    expect(queryByRole("button", { name })).toBeInTheDocument()
    unmount()
})

test("show tensor", () => {
    const graph = createGraph()
    const pos: Vec2 = [0, 0]
    const start = graph.addNode({ type: "num", data: -10 }, pos)
    const stop = graph.addNode({ type: "num", data: 10 }, pos)
    const num = graph.addNode({ type: "num", data: 3 }, pos)
    const linspace = graph.addNode({ type: "call", name: "linspace" }, pos)
    graph.addEdge({ input: linspace.inputs[0], node: start.id })
    graph.addEdge({ input: linspace.inputs[1], node: stop.id })
    graph.addEdge({ input: linspace.inputs[2], node: num.id })
    expect(linspace.self).toEqual({ type: "call", name: "linspace" })
    expect(linspace.output!.value).toEqual({
        type: "tensor",
        data: [-10, 0, 10],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    })
    const { queryByRole, unmount } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent node={linspace} />
                </MockPositionsProvider>
            </MockMeasureTextProvider>
        </GraphProvider>
    ))
    const name = `body ${linspace.id}`
    const container = queryByRole("grid", { name })!
    expect(container).toBeInTheDocument()
    expect(container.children.length).toEqual(3)
    expect(container.children[0]).toHaveTextContent("-10")
    expect(container.children[1]).toHaveTextContent("0")
    expect(container.children[2]).toHaveTextContent("10")
    unmount()
})
