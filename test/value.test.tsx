import { render, fireEvent } from "@solidjs/testing-library"
import { uuid } from "fast-check"
import { JSXElement } from "solid-js"
import { vi } from "vitest"

import { Body, GraphProvider } from "../src/Graph"
import { createGraph, UUID } from "../src/Graph/graph"
import { BodyContent } from "../src/Graph/NodeCards/BodyContent"
import { Positions, PositionsContext } from "../src/Graph/positions"
import { MeasureText, MeasureTextContext } from "../src/MeasureText"

import { Value, base, call } from "../src/value"
import { Vec2 } from "../src/vec2"

test("add 2 and 3 to get 5", () => {
    const a: Value = {
        type: "Number",
        data: 3,
    }
    const b: Value = {
        type: "Number",
        data: 2,
    }
    const c: Value = call(base, "add", [a, b])
    expect(c).toEqual({
        type: "Tensor",
        data: 5,
        size: 1,
        shape: [],
        rank: 0,
        dtype: "float32",
    })
})

test("add 2 and [1, 2, 3] to get [3, 4, 5]", () => {
    const a: Value = {
        type: "Number",
        data: 2,
    }
    const b: Value = {
        type: "Tensor",
        data: [1, 2, 3],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    }
    const c: Value = call(base, "add", [a, b])
    expect(c).toEqual({
        type: "Tensor",
        data: [3, 4, 5],
        size: 3,
        shape: [3],
        rank: 1,
        dtype: "float32",
    })
})

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

test("show number and edit value", () => {
    const graph = createGraph()
    const node = graph.addNode("num", [0, 0])
    const body = graph.database.bodies[node.body]
    expect(body.value).toEqual({ type: "Number", data: 0 })
    const { queryByText, unmount, queryByDisplayValue } = render(() => (
        <GraphProvider graph={graph}>
            <MockMeasureTextProvider>
                <MockPositionsProvider>
                    <BodyContent body={body} />
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
    const nextBody = graph.database.bodies[node.body]
    expect(nextBody.value).toEqual({ type: "Number", data: 3 })
    fireEvent.blur(input)
    expect(input).not.toBeInTheDocument()
    expect(queryByText("3")!).toBeInTheDocument()
    unmount()
})
