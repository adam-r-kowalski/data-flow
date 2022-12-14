import { expect, test } from "vitest"
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
    expect(queryByRole("link", { name: /edge.*/ })).not.toBeInTheDocument()
    fireEvent.click(output)
    fireEvent.click(input)
    expect(queryByRole("link", { name: /edge.*/ })).toBeInTheDocument()
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

test("right clicking on the graph opens the menu", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    const background = queryByRole("application", { name: "background" })!
    expect(background).toBeInTheDocument()
    fireEvent.contextMenu(background)
    const menu = queryByRole("menu", { name: "menu" })
    expect(menu).toBeInTheDocument()
    const select = queryByRole("menuitem", { name: "select" })
    expect(select).toBeInTheDocument()
    const search = queryByRole("menuitem", { name: "search" })
    expect(search).toBeInTheDocument()
    const num = queryByRole("menuitem", { name: "num" })
    expect(num).toBeInTheDocument()
    const add = queryByRole("menuitem", { name: "add" })
    expect(add).toBeInTheDocument()
    const sub = queryByRole("menuitem", { name: "sub" })
    expect(sub).toBeInTheDocument()
    unmount()
})

test("clicking search in menu opens finder", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    const background = queryByRole("application", { name: "background" })!
    expect(background).toBeInTheDocument()
    fireEvent.contextMenu(background)
    const menu = queryByRole("menu", { name: "menu" })
    expect(menu).toBeInTheDocument()
    const search = queryByRole("menuitem", { name: "search" })!
    fireEvent.pointerUp(search)
    expect(menu).not.toBeInTheDocument()
    const finder = queryByRole("dialog", { name: "finder" })
    expect(finder).toBeInTheDocument()
    unmount()
})

test("pressing `f` opens finder", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const finder = queryByRole("dialog", { name: "finder" })
    expect(finder).toBeInTheDocument()
    unmount()
})

test("when finder opens the search bar is focused", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const finder = queryByRole("dialog", { name: "finder" })
    expect(finder).toBeInTheDocument()
    const search = queryByRole("searchbox", { name: "finder search" })
    expect(search).toBeInTheDocument()
    expect(search).toHaveFocus()
    unmount()
})

test("when finder opens pressing `esc` closes it", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const search = queryByRole("searchbox", { name: "finder search" })!
    expect(search).toBeInTheDocument()
    fireEvent.keyDown(search, { key: "Escape" })
    expect(search).not.toBeInTheDocument()
    unmount()
})

test("when finder opens clicking the background closes it", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const finder = queryByRole("dialog", { name: "finder" })!
    expect(finder).toBeInTheDocument()
    fireEvent.click(finder)
    expect(finder).not.toBeInTheDocument()
    unmount()
})

test("typing into finder search field narrows shown options", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const finder = queryByRole("dialog", { name: "finder" })
    expect(finder).toBeInTheDocument()
    const search = queryByRole("searchbox", { name: "finder search" })!
    const selections = queryByRole("grid", { name: "finder selections" })!
    expect(selections).toBeInTheDocument()
    const length = selections.children.length
    fireEvent.input(search, { target: { value: "add" } })
    expect(search).toHaveValue("add")
    const newLength = selections.children.length
    expect(newLength).toBeLessThan(length)
    expect(selections.children[0]).toHaveTextContent("add")
    unmount()
})

test("pressing enter when finder is open adds node to graph and closes the finder", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const finder = queryByRole("dialog", { name: "finder" })
    expect(finder).toBeInTheDocument()
    const search = queryByRole("searchbox", { name: "finder search" })!
    fireEvent.input(search, { target: { value: "add" } })
    expect(queryByRole("region", { name: /node.*/ })).not.toBeInTheDocument()
    fireEvent.keyDown(search, { key: "Enter" })
    expect(finder).not.toBeInTheDocument()
    const node = queryByRole("region", { name: /node.*/ })
    expect(node).toBeInTheDocument()
    expect(node).toHaveTextContent("add")
    unmount()
})

test("clicking a selection when finder is open adds node to graph and closes the finder", () => {
    const graph = createGraph()
    const { unmount, queryByRole } = render(() => (
        <MockMeasureTextProvider>
            <DataFlow graph={graph} />
        </MockMeasureTextProvider>
    ))
    fireEvent.keyDown(document, { key: "f" })
    const finder = queryByRole("dialog", { name: "finder" })
    expect(finder).toBeInTheDocument()
    expect(queryByRole("region", { name: /node.*/ })).not.toBeInTheDocument()
    const selection = queryByRole("gridcell", { name: "num" })!
    expect(selection).toBeInTheDocument()
    expect(selection).toHaveTextContent("num")
    fireEvent.click(selection)
    expect(finder).not.toBeInTheDocument()
    const node = queryByRole("region", { name: /node.*/ })
    expect(node).toBeInTheDocument()
    expect(node).toHaveTextContent("num")
    unmount()
})
